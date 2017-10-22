var roomControl = require('room.alpha');
var spawner = require('spawner');


module.exports.loop = function () {
	for(let name in Memory.creeps)
	{
		if(Game.creeps[name]==undefined)
		{
			delete Memory.creeps[name];
		}
	}

	for (Room in Game.rooms) {
		spawner.run(Room);
		roomControl.run(Room)
		if (Room.find(Game.FIND_HOSTILE_CREEPS).length > 0) {
			Room.controller.activateSafeMode();
		}
	}
}
