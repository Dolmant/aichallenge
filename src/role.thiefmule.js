// @flow
const roleThiefMule = {
    run: function(creep: Creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (!creep.memory.stealTarget) {
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52', 'W45N51', 'W46N53'];
            const homeArray = ['W43N53', 'W41N51', 'W41N51', 'W43N53', 'W43N53', 'W41N51', 'W45N53', 'W45N53', 'W45N53'];

            if (possibleTargets.length <= Memory.muleFlag) {
                Memory.muleFlag = 1;
            } else {
                Memory.muleFlag += 1;
            }
            creep.memory.goToTarget = possibleTargets[Memory.muleFlag - 1];
            creep.memory.stealTarget = possibleTargets[Memory.muleFlag - 1];
            creep.memory.home = homeArray[Memory.muleFlag - 1];
        }
        if (_.sum(creep.carry) == 0 && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        }
        if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        }
        if (_.sum(creep.carry) == 0 && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        }
        if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
	}
};

export default roleThiefMule;
