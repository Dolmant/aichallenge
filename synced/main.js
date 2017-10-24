var roomControl = require('room.alpha');

module.exports.loop = function () {
	if (!Memory.structures) {Memory.structures = {}};
	for(let name in Memory.creeps)
	{
		if(Game.creeps[name]==undefined)
		{
			delete Memory.creeps[name];
		}
	}
	for(let name in Memory.rooms)
	{
		if(Game.rooms[name]==undefined)
		{
			delete Memory.rooms[name];
		}
	}

	for (roomName in Game.rooms) {
		var Room = Game.rooms[roomName]
		roomControl.run(Room)
		if (Room.find(FIND_HOSTILE_CREEPS).length > 0 && !Room.controller.safeMode && !Room.controller.safeModeCooldown && Room.controller.safeModeAvailable) {
			Room.controller.activateSafeMode();
		}
	}
}
