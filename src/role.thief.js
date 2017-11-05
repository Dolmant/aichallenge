// @flow
const roleThief = {
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (!creep.memory.stealTarget) {
            // TODO fix !!!!
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53']; // 'W43N51' not owned yet

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
            creep.memory.goToTarget = possibleTargets[Memory.stealFlag - 1];
            creep.memory.stealTarget = possibleTargets[Memory.stealFlag - 1];
        }

        if (creep.room.name == creep.memory.stealTarget) {
            if (creep.carry.energy == 0) {
                creep.memory.myTask = 'harvest';
            } else {
                creep.memory.myTask = 'lazydeposit';
            }
        } else if (creep.carry.energy == 0) {
			creep.memory.myTask = 'goToTarget';
        }
	}
};

export default roleThief;
