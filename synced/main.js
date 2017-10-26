var roomControl = require('room.alpha');

module.exports.loop = function () {
	for(let name in Memory.creeps)
	{
		if(Game.creeps[name]==undefined)
		{
			delete Memory.creeps[name];
		}
	}
	// for(let name in Memory.attackers.creeps)
	// {
	// 	if(Game.creeps[name]==undefined)
	// 	{
	// 		delete Memory.creeps[name];
	// 	}
	// }
	Memory.attackers.forceInAction = {
		'healer': 0,
		'melee': 0,
		'ranged': 0,
	};
	// Lets keep this around just in case
	// for(let name in Memory.rooms)
	// {
	// 	if(Game.rooms[name]==undefined)
	// 	{
	// 		delete Memory.rooms[name];
	// 	}
	// }

	for (roomName in Game.rooms) {
		var Room = Game.rooms[roomName]
		roomControl.run(Room)
	}
	Memory.attackers.forceInActionCount = {
		'healer': Memory.attackers.forceInAction.healer,
		'ranged': Memory.attackers.forceInAction.ranged,
		'melee': Memory.attackers.forceInAction.melee
	};
}
