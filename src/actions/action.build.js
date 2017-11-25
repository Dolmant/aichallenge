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
                var err = creep.build(target);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveToCacheTarget(target.pos);
                } else if (err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_RCL_NOT_ENOUGH || err == ERR_INVALID_TARGET) {
                    // expect state change to resupply
                    return true;
                }
                if (!target) {
                    findBuildTarget(creep);
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
