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
        const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52', 'W45N51', 'W46N53'];
        
        // const exits = Game.map.describeExits(creep.room.name)
        // for (name in exits) {
        //     // This is still breaking
        //     if (Game.map.isRoomAvailable(exits[name]) && !(Memory.rooms[name] && !Memory.rooms[name].owner)) {
        //         possibleTargets.push(exits[name])
        //     }
        // }
        if (possibleTargets.length <= Memory.stealFlag) {
            Memory.stealFlag = 1;
        } else {
            Memory.stealFlag += 1;
        }
        return possibleTargets[Memory.stealFlag - 1];
    },
};

export default roleThief;
