// @flow
const roleWorker = {
    run: function(creep: Creep) {
        if(creep.fatigue != 0){
            return;
        }

        if(creep.memory.myTask == 'repair' || creep.memory.myTask == 'build' || creep.memory.myTask == 'upgrade') {
            if (creep.memory.carry.energy == 0) {
                creep.memory.myTask = 'resupply';
            } else if (creep.memory.myBuildTarget) {
                creep.memory.myTask = 'resupply';
            } else {
                creep.memory.myTask = 'upgrade';
            }
        }
        if(creep.memory.myTask == 'resupply' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'build';
        }
    }
};

export default roleWorker;
