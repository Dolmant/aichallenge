// @flow
const roleThief = {
    run(creep: Creep) {
        if (creep.memory.myTask == 'lazydeposit' && creep.memory.myBuildTarget) {
            creep.memory.myTask = 'build';
        } else if (creep.room.name == creep.memory.stealTarget) {
            if (creep.carry.energy < creep.carryCapacity) {
                if (creep.memory.myTask == 'harvest') {
                    creep.memory.myTask = 'moveToTarget';
                } else {
                    creep.memory.myTask = 'harvest';
                }
            } else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.myTask = 'lazydeposit';
            }
        } else {
			creep.memory.goToTarget = creep.memory.stealTarget;
			creep.memory.myTask = 'goToTarget';
        }
    },
    generateStealTarget() {
        // TODO fix !!!!
        let target;
        if (global.thieving_spots) {
            const targets = Object.keys(global.thieving_spots)
            for (var i = 0; i < targets.length; i += 1) {
                if (global.thieving_spots[targets[i]] == 0) {
                    return targets[i];
                }
            }
        } else {
            console.log('no thief object, failed');
            return '59bbc4262052a716c3ce7711';
        }
    },
};

export default roleThief;
