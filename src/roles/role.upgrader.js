// @flow
const roleUpgrader = {
    run: function(creep: Creep) {
        if (creep.fatigue != 0) {
			return;
        }

        if(!(creep.memory.myTask == 'upgrade') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrade';
        }
        if(creep.carry.energy == 0) {
            creep.memory.myTask = 'resupply';
        }
    }
};

export default roleUpgrader;
