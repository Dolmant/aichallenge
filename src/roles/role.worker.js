// @flow
const roleWorker = {
    run: function(creep: Creep) {
        if (creep.fatigue != 0){
            return;
        }

        if (creep.memory.myTask != 'resupply') {
            if (creep.carry.energy == 0) {
                creep.memory.myTask = 'resupply';
            } else if (creep.memory.myBuildTarget) {
                creep.memory.myTask = 'resupply';
            } else {
                creep.memory.myTask = 'upgrade';
            }
        }
        if (creep.memory.myTask == 'resupply') {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.myTask = 'build';
            } else {
                creep.memory.myTask = 'moveToTarget';
            }
        }
    }
};

export default roleWorker;
