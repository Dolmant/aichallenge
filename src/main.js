// @flow
import RoomController from './room';
import cronJobs from './cron';
// docs:
/*
place a flag names 'Attack' to designate the attack room and location
place a flag names 'Marshal' to designate a staging area.
To specify size, change forceSize on the Memory.attackers object
To tell a room to marshal a force, change the room flag 'marshalForce' to true
You can send a worker to another room by specifying the roomname on goToTarget and change their task name to goToTarget (make this global)

You can claim by placing a Claim flag setting myRoom.memory.spawnClaimer to the number of claimers you want
*/

Creep.prototype.moveToCacheXY = function(x, y) {
    const dest = new RoomPosition(x, y, this.room.name);
    this.moveToCacheTarget(dest)
}
Creep.prototype.moveToCacheTarget = function(target) {
    // check cache
    const dest = target.roomName + target.x + target.y;
    const from = this.pos.roomName + this.pos.x + this.pos.y
    if (Memory.pathCache[dest] && Memory.pathCache[dest][from]) {
        Memory.pathCache[dest][from].called += 1;
        return this.moveByPath(Memory.pathCache[dest][from].path);
    } else {
        const path = Room.serializePath(PathFinder.search(this.pos, target, {
            'maxOps': 5,
            'maxRooms': 16,
            'ignoreCreeps': true,
        }));
        if (!Memory.pathCache[dest]) {
            Memory.pathCache[dest] = {};
        }
        Memory.pathCache[dest][from] = {
            path,
            called: 0,
        };
    }
}


export function loop() {
    for(let name in Memory.creeps)
    {
        if(Game.creeps[name]==undefined)
        {
            delete Memory.creeps[name];
        }
    }

    Memory.stats['cpu.links'] = 0;
    Memory.stats['cpu.runTowers'] = 0;
    Memory.stats['cpu.roomUpdateConsts'] = 0;
    Memory.stats['cpu.roomInit']  = 0;

    Memory.stats['cpu.cron'] = Game.cpu.getUsed();
    cronJobs.run();
    Memory.stats['cpu.cron'] = Game.cpu.getUsed() - Memory.stats['cpu.cron'];
    Memory.misc.globalCreepsTemp = {
        'healer': 0,
        'melee': 0,
        'ranged': 0,
        'thief': 0,
        'thiefmule': 0,
        'claimer': 0,
        'tough': 0,
        'blocker': 0,
    };
    // Lets keep this around just in case?
    // for(let name in Memory.rooms)
    // {
    // 	if(Game.rooms[name]==undefined)
    // 	{
    // 		delete Memory.rooms[name];
    // 	}
    // }

    // for dashboard
    if (Memory.stats == undefined) {
        Memory.stats = {}
    }
        
    var rooms = Game.rooms;
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey]
        var isMyRoom = (room.controller ? room.controller.my : 0)
        if (isMyRoom) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
            Memory.stats['room.' + room.name + '.controllerSpeed'] = room.controller.progress - Memory.stats['room.' + room.name + '.controllerProgress'];
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;
            var stored = 0
            var storedTotal = 0
        
            if (room.storage) {
                stored = room.storage.store[RESOURCE_ENERGY]
                storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY]
            } else {
                stored = 0
                storedTotal = 0
            }
            Memory.stats['room.' + room.name + '.storedEnergy'] = stored
        } else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress;
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
    Memory.stats['gcl.level'] = Game.gcl.level;

    Memory.stats['cpu.roomController'] =Game.cpu.getUsed();
    for (let roomName in Game.rooms) {
        let Room = Game.rooms[roomName]
        RoomController.run(Room)
    }
    Memory.stats['cpu.roomController'] = Game.cpu.getUsed() - Memory.stats['cpu.roomController'];

    Memory.misc.globalCreeps = {
        'healer': Memory.misc.globalCreepsTemp.healer,
        'ranged': Memory.misc.globalCreepsTemp.ranged,
        'melee': Memory.misc.globalCreepsTemp.melee,
        'thief': Memory.misc.globalCreepsTemp.thief,
        'thiefmule': Memory.misc.globalCreepsTemp.thiefmule,
        'claimer': Memory.misc.globalCreepsTemp.claimer,
        'tough': Memory.misc.globalCreepsTemp.tough,
        'blocker': Memory.misc.globalCreepsTemp.blocker,
    };

    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
    Memory.stats['cpu.limit'] = Game.cpu.limit;
}
