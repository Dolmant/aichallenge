// @flow
const roleUpgrader = {
    run: function(creep) {
        if (creep.fatigue != 0){
			return;
        }

        if(!(creep.memory.myTask == 'upgrading') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrading';
        }
        if(creep.carry.energy == 0)
        {
            creep.memory.myTask = 'resupply';
        }
    }
};

export default roleUpgrader;
