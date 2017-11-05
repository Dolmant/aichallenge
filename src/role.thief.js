// @flow
import actHarvest from './action.harvest';
import actUpgrade from './action.upgrade';
import actDeposit from './action.deposit';
import util from './util';

const roleThief = {
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (!creep.memory.home) {
            creep.memory.home = {
                room: creep.room.name,
            };
        }

        // TODO THE CREEP CAN NO LONGER RETURN HOME
        if (!creep.memory.goToTarget) {
            // TODO fix !!!!
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53']; // 'W43N51' not owned yet
            // const exits = Game.map.describeExits(creep.room.name)
            // for (name in exits) {
            //     // This is stil lbreaking
            //     if (Game.map.isRoomAvailable(exits[name]) && !(Memory.rooms[name] && !Memory.rooms[name].owner)) {
            //         possibleTargets.push(exits[name])
            //     }
            // }
            if (possibleTargets.length <= creep.room.memory.stealFlag) {
                creep.room.memory.stealFlag = 1;
            } else {
                creep.room.memory.stealFlag += 1;
            }
            creep.memory.goToTarget = possibleTargets[creep.room.memory.stealFlag - 1];
        }

        if (creep.room.name == creep.memory.goToTarget) {
            creep.memory.myTask = 'harvest';
        } else if (creep.carry.energy == 0) {
			creep.memory.myTask = 'goToTarget';
        }

        if (creep.room.name == creep.memory.home.room && creep.carry.energy > 0) {
            if (creep.memory.secondaryRole == 'upgrader') {
                creep.memory.myTask = 'upgrade';
            } else {
                creep.memory.myTask = 'deposit';
            }
        } else if (creep.carryCapacity == creep.carry.energy) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home.room;
        }
	}
};

export default roleThief;
