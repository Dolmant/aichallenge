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

            // TODO fix this to find an optimal one
            for (name in Game.map.describeExits(creep.room.name)) {
                if (Game.map.isRoomAvailable(name)) {
                    creep.memory.target = name;
                }
            }
            // TODO remove hardcoding
            creep.memory.target = 'E43N51';
        }

		if (creep.carry.energy == 0) {
			creep.memory.myTask = 'goToTarget';
        }

		if (creep.room.name == creep.memory.target) {
			creep.memory.myTask = 'steal';
		}

		if (creep.carryCapacity == creep.carry.energy) {
			creep.memory.myTask = 'goHome';
        }
        
        if (creep.room.name == creep.memory.home.room) {
			creep.memory.myTask = 'upgrading';
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
			case 'upgrading':
                actUpgrade.run(creep);
				break;
			default:
				creep.memory.myTask = 'harvest';
			    break;
		}
	}
};

module.exports = roleThief;
