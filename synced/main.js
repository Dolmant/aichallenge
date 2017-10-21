var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMule = require('role.mule');
var roomControl = require('room.alpha');


module.exports.loop = function () {
    var MaxHarvester = 12;
    var MaxBuilder = 2;
    var MaxMule = 1;
    var MaxUpgrader = 20;

    RoomName = 'E43N52';
    //go through all the creeps and find the ones under control for this room

	if (Game.rooms[RoomName].find(Game.FIND_HOSTILE_CREEPS).length > 0) {
	    Game.rooms[RoomName].controller.activateSafeMode();
	}

    runTower('59b47e88e1065233e38d42ee');

	for(let name in Memory.creeps)
	{
		if(Game.creeps[name]==undefined)
		{
			delete Memory.creeps[name];
		}
	}
    var MyCreeps = {
        harvester: 0,
        upgrader: 0,
        builder: 0,
        mule: 0,
    };
    // something went wrong here, all creeps died
    var totalEnergy = Math.floor((Game.spawns['Spawn1'].room.energyCapacityAvailable / 2) / 50);
    //var totalEnergy = Math.floor((200) / 50);
    var referenceEnergy = totalEnergy * 50
    var workarray = [];
    while (totalEnergy >= 4) {
        totalEnergy -= 4
        workarray.push(WORK)
        workarray.push(MOVE)
        workarray.push(CARRY)
    }
    referenceEnergy -= totalEnergy * 50
    //console.log(referenceEnergy)
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		switch(creep.memory.role){
            case 'harvester':
                roleHarvester.run(creep);
    			MyCreeps.harvester += 1;
    			break;
            case 'upgrader':
                roleUpgrader.run(creep);
    			MyCreeps.upgrader += 1;
    			break;
            case 'builder':
                roleBuilder.run(creep);
    			MyCreeps.builder += 1;
                break;
            case 'mule':
                roleMule.run(creep);
    			MyCreeps.mule += 1;
                break;
    		default:
    		break;
		}
    }
    
	if (!Game.spawns['Spawn1'].spawning)
	{
	    
		if(MyCreeps.harvester < MaxHarvester  && Game.spawns['Spawn1'].room.energyAvailable >= referenceEnergy)
		{
		    var newName = 'Harvester' + Game.time;
			Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory:{role:'harvester'}});
			console.log('Spawning: low '+ newName);
		}
		else
		{
    		if(MyCreeps.builder < MaxBuilder && Game.spawns['Spawn1'].room.energyAvailable >= referenceEnergy)
    		{
    		    var newName = 'Builder' + Game.time;
    			Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory:{role:'builder'}});
    			console.log('Spawning: low '+ newName);
    		}
    		else
    		{
	    		if(MyCreeps.mule < MaxMule && Game.spawns['Spawn1'].room.energyAvailable >= referenceEnergy)
        		{
        		    var newName = 'Mule' + Game.time;
        			Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory: {role:'mule'}});
        			console.log('Spawning: low '+ newName);
        		}
        		else
    		    {
    	    		if(MyCreeps.upgrader < MaxUpgrader && Game.spawns['Spawn1'].room.energyAvailable >= referenceEnergy)
            		{
            		    var newName = 'Upgrader' + Game.time;
            			Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory: {role:'upgrader'}});
            			console.log('Spawning: low '+ newName);
            		}
    		    }
    		}
		}
	}
	else
	{
	    if(MyCreeps.harvester < 1)//just in case, if there are no harvesters spawn a harvester
	    {
	        Game.spawns['Spawn1'].createCreep( [WORK, CARRY,MOVE,MOVE], undefined,{role:'harvester'} );
	    }
    }

    roomControl.run('E43N52');
}

function runTower(towerID)
{
	var tower = Game.getObjectById(towerID);
	var minRepair = 860000;
	if(tower) {
		var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if(closestHostile) {
			tower.attack(closestHostile);
		}
		else
		{
			
			var rampRepair = tower.room.find(FIND_STRUCTURES, {filter: s=> s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL});
			for (let ramps of rampRepair)
			{
				if(ramps.hits < minRepair)//this could be a problem during an assault where towers start repairing instead of attacking.
				{
					tower.repair(ramps);
				}
			}
			var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
			if (creepToRepair != undefined)
			{
				tower.heal(creepToRepair);
			}
		}
	}
}