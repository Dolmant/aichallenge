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
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                if (creep.room.controller.ticksToDowngrade < 2200) {
                    creep.memory.myTask = 'upgrade';
                } else {
                    creep.memory.myTask = 'build';
                }
            } else {
                creep.memory.myTask = 'moveToTarget';
            }
        }
    }
};

export default roleWorker;
