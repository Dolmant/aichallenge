// @flow

import cronJobs from './../cron';

const roleThief = {
    run(creep: Creep) {
        if (!creep.memory.sourceMap) {
            console.log('thief genned without map')
        }
        if (creep.memory.myTask == 'lazydeposit' && creep.memory.myBuildTarget) {
            creep.memory.myTask = 'build';
        } else if (!creep.carryCapacity || creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.myTask == 'moveToObject' && creep.memory.moveToObject) {
                if (Memory.roomMap && Memory.roomMap[creep.memory.moveToObject]) {
                    creep.memory.goToTarget = Memory.roomMap[creep.memory.moveToObject];
                    creep.memory.myTask = 'goToTarget';
                } else {
                    creep.memory.myTask = 'moveToObject';
                }
            } else if (creep.memory.myTask == 'harvest') {
                //harvest appends these details
                creep.memory.myTask = 'moveToTarget';
            } else {
                creep.memory.myTask = 'harvest';
            }
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'lazydeposit';
        }
    },
    generateStealTarget() {
        // TODO fix !!!!
        let target;
        if (Memory.thieving_spots) {
            cronJobs.run10();
            const targets = Object.keys(Memory.thieving_spots)
            for (var i = 0; i < targets.length; i += 1) {
                if (Memory.thieving_spots[targets[i]] == 0) {
                    return targets[i];
                }
            }
            console.log('no spare thief found, queried: ' + targets.length + ' times');
            return '59bbc4262052a716c3ce7711';
        } else {
            console.log('no thief object, failed');
            return '59bbc4262052a716c3ce7711';
        }
    },
};

export default roleThief;
