var roomControl = require('room.alpha');

// docs:
/*
place a flag names 'Attack' to designate the attack room and location
place a flag names 'Marshal' to designate a staging area.
To specify size, change forceSize on the Memory.attackers object
To tell a room to marshal a force, change the room flag 'marshalForce' to true
You can send a builder to another room by specifying the roomname on goToTarget and change their task name to goToTarget (make this global)

You can claim by placing a Claim flag setting myRoom.memory.spawnClaimer to the number of claimers you want
*/

module.exports.loop = function () {
	for(let name in Memory.creeps)
	{
		if(Game.creeps[name]==undefined)
		{
			delete Memory.creeps[name];
		}
	}
	Memory.attackers.forceInAction = {
		'healer': 0,
		'melee': 0,
		'ranged': 0,
		'thief': 0,
	};
	// Lets keep this around just in case?
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
		'melee': Memory.attackers.forceInAction.melee,
		'thief': Memory.attackers.forceInAction.thief
	};
}
