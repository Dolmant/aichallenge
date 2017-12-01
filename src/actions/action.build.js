// @flow
const actBuild = {
    run: function(creep: Creep) {
        //do I already have something to build? If not find something to fix and say fixit
        if(!creep.memory.myBuildTarget && !creep.memory.myRepairTarget) {
            findBuildTarget(creep);
            if(!creep.memory.myBuildTarget)
            {
                // expect state change to upgrade
                return true;
                
                // towers can repair instead
                // findRepairTarget(creep);
                // if (!creep.memory.myRepairTarget) {
                // }
            }
        }
        else {
            if (creep.memory.myBuildTarget) {
                var target: ConstructionSite = Game.getObjectById(creep.memory.myBuildTarget);
                if (!target) {
                    findBuildTarget(creep);
                } else {
                    var err = creep.build(target);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.moveToCacheTarget(target.pos);
                    } else if (err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_RCL_NOT_ENOUGH || err == ERR_INVALID_TARGET) {
                        // expect state change to resupply
                        return true;
                    }
                }
            } else if (creep.memory.myRepairTarget) {
                target: Structure = Game.getObjectById(creep.memory.myRepairTarget);
                var err = creep.repair(target);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveToCacheTarget(target.pos);
                } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    //expect state change to resupply
                    return true;
                }
                if (!target || target.hits == target.hitsMax) {
                    findBuildTarget(creep);
                    findRepairTarget(creep);
                }
            }
        }
    },
    roadWorks: function(creep: Creep) {
        if (creep.carry.energy > creep.carryCapacity * 0.5) {
            const constSites = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            const structs = creep.pos.lookFor(LOOK_STRUCTURES);
            let target;
            let err = 1;
            if (constSites.length > 0) {
                target = constSites[0];
                err =creep.build(target);
            } else if (structs.length > 0) {
                structs.forEach(struct => {
                    if (!target && struct.hits < struct.hitsMax * 0.8) {
                        target = struct;
                        err = creep.repair(struct);
                    }
                })
            } else {
                target = 1;
                err = creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
            if (target && err == OK) {
                return true;
            }
        }
        return false;
    },
};

function findBuildTarget(creep){
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    creep.memory.myBuildTarget = target && target.id;
}
// not used currently
function findRepairTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) =>
            (s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax
    });

    creep.memory.myRepairTarget = target && target.id;
}

export default actBuild;
