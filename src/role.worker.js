// @flow
const roleWorker = {
    run: function(creep) {
		if(creep.fatigue != 0){
			return;
		}

		if((creep.memory.myTask == 'repair' || creep.memory.myTask == 'build' || creep.memory.myTask == 'upgrade') && creep.carry.energy == 0){
    		creep.memory.myTask = 'resupply';
		}
		if(creep.memory.myTask == 'resupply' && creep.carry.energy == creep.carryCapacity)
		{
			creep.memory.myTask = 'build';
		}
    }
};

export default roleWorker;
