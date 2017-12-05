// @flow
const roleThiefMule = {
    run(creep: Creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (creep.memory.myTask == 'fetch' && _.sum(creep.carry) == 0) {
            creep.memory.myTask = 'moveToTarget';
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter: structure => (structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 200)
            }) || {pos: {x: 25, y: 25}};
            creep.memory.moveToTargetx = target.pos.x;
            creep.memory.moveToTargety = target.pos.y;
            creep.memory.moveToTargetrange = 1;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.75 && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        } else if (_.sum(creep.carry) >= creep.carryCapacity* 0.75 && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.5 && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        } else if (_.sum(creep.carry) >= creep.carryCapacity * 0.5 && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
    },
};

export default roleThiefMule;
