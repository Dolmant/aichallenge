// @flow
const actBuild = {
    run: function(creep: Creep) {
        //do I already have something to build? If not find something to fix and say fixit
        if(!creep.memory.myBuildTarget && !creep.memory.myRepairTarget) {
            findBuildTarget(creep);
            if(!creep.memory.myBuildTarget)
            {
                creep.memory.myTask = 'upgrade';
                // towers can repair instead
                // findRepairTarget(creep);
                // if (!creep.memory.myRepairTarget) {
                // }
            }
        }
        else {
            if (creep.memory.myBuildTarget) {
                var target: ConstructionSite = Game.getObjectById(creep.memory.myBuildTarget);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {'maxRooms': 1});
                }
                if (!target) {
                    findBuildTarget(creep);
                }
            } else if (creep.memory.myRepairTarget) {
                target: Structure = Game.getObjectById(creep.memory.myRepairTarget);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {'maxRooms': 1});
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
