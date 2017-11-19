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
        } else if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        } else if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        } else  if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        } else  if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
    },
    generateHaulTargets() {
        const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52', 'W45N51', 'W46N53', 'W47N52', 'W46N51'];
        const homeArray = ['W43N53', 'W41N51', 'W46N52', 'W43N53', 'W43N53', 'W41N51', 'W45N53', 'W46N52', 'W45N53', 'W46N52', 'W46N52'];

        if (possibleTargets.length <= Memory.muleFlag) {
            Memory.muleFlag = 1;
        } else {
            Memory.muleFlag += 1;
        }
        return [possibleTargets[Memory.muleFlag - 1], homeArray[Memory.muleFlag - 1]];
    }
};

export default roleThiefMule;
