var actSteal = require('action.steal');
var actUpgrade = require('action.upgrade');
var actDeposit = require('action.deposit');

var roleThief = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (!creep.memory.home) {
            creep.memory.home = {
                room: creep.room.name,
                x: creep.pos.x,
                y: creep.pos.y,
            };
        }
        if (!creep.memory.target) {
            // TODO fix this to find an optimal one
            const possibleTargets = [];
            const exits = Game.map.describeExits(creep.room.name)
            for (name in exits) {
                if (Game.map.isRoomAvailable(exits[name])) {
                    possibleTargets.push(exits[name])
                }
            }
            if (possibleTargets.length < creep.room.memory.stealFlag) {
                creep.room.memory.stealFlag = 1;
            } else {
                creep.room.memory.stealFlag += 1;
            }
            creep.memory.target = possibleTargets[creep.room.memory.stealFlag - 1];
        }

        // TODO: fix this to be less order dependant
      
        if (creep.carry.energy == 0) {
			creep.memory.myTask = 'goToTarget';
        }

        if (creep.room.name == creep.memory.target) {
			creep.memory.myTask = 'steal';
        }
        
        if (creep.carryCapacity == creep.carry.energy) {
			creep.memory.myTask = 'goHome';
        }

        if (creep.room.name == creep.memory.home.room && creep.carry.energy > 0) {
			creep.memory.myTask = 'deposit';
        }
		
		switch(creep.memory.myTask){
            case 'goToTarget':
                if (creep.pos.x == 0) {
                    creep.move(RIGHT);
                } else if (creep.pos.x == 49) {
                    creep.move(LEFT);
                } else if (creep.pos.y == 0) {
                    creep.move(BOTTOM);
                } else if (creep.pos.y == 49) {
                    creep.move(TOP);
                } else {
                    creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.target)))
                }
                break;
			case 'steal':
				actSteal.run(creep);
			    break;
            case 'goHome':
                var homepath = new RoomPosition(creep.memory.home.x, creep.memory.home.y, creep.memory.home.room);
                creep.moveTo(homepath);
				break;
			case 'deposit':
                actDeposit.run(creep);
				break;
			default:
				creep.memory.myTask = 'harvest';
			    break;
		}
	}
};

module.exports = roleThief;
