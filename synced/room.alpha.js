var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleMule = require('role.mule');
var roleBuilder = require('role.builder');
var spawner = require('spawner');


var runRoom = {

    run: function(myRoom) {
        //TODO: search the room and find my towers.

        var myCreeps = myRoom.find(FIND_MY_CREEPS);
        var mySpawns = myRoom.find(FIND_MY_SPAWNS);
        // this doesnt work
        // var tower_test = Room.find(STRUCTURE_TOWER);
        // console.log(tower_test);
        //TODO: make the towers dynamic
        //myTowers = myRoom.find(STRUCTURE_TOWER);
        runTower('59b47e88e1065233e38d42ee');

        var myCreepCount = {
            harvester: 0,
            upgrader: 0,
            builder: 0,
            mule: 0,
        };

        myCreeps.forEach(creep => {
            switch(creep.memory.role){
                case 'harvester':
                    roleHarvester.run(creep);
                    myCreepCount.harvester += 1;
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    myCreepCount.upgrader += 1;
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    myCreepCount.builder += 1;
                    break;
                case 'mule':
                    roleMule.run(creep);
                    myCreepCount.mule += 1;
                    break;
                default:
                break;
            }
        })
        spawner.run(myRoom, mySpawns, myCreepCount)

        if(myRoom.memory.timer == undefined)
        {
            myRoom.memory.timer =0;
        }
        else
        {
            myRoom.memory.timer++;
        }
	}
}

function getJobs(MyRoom)
{
    var jobList = [];

    tempJobList =findRepairTarget(MyRoom);
    if(tempJobList!=0)
    {
        for(var i=0;i<tempJobList.length;i++)
        {
            jobList.push(["repair", tempJobList[i].id]);
        }
    }
    var tempJobList =findBuildTarget(MyRoom);
    if(tempJobList!=0)
    {
        for(var i=0;i<tempJobList.length;i++)
        {
            jobList.push(["build", tempJobList[i].id]);
        }
    }
    return jobList;
}
/*
//purpose of this fun
function filterJobs(jobList, busyCreeps)
{
    var refinedJobList = jobList.slice;
    for(var i =0;i<jobList.length;i++)
    {
        for(var i1=0;i1<busyCreeps.length;i1++)
        {
            if(joblist[i][] == busyCreeps)
        }
    }
}
*/
function prioritizeJobs(jobs, busyCreeps)
{
    var bCreeps = busyCreeps.slice();//make a copy of the possible creeps to iterate through
    var returnJobs = [];
    for(var i =0;i<jobs.length;i++)
    {
        for(var i1 = 0; i1<bCreeps.length;i1++)
        {
            
        }
    }
}

function findBuildTarget(myRoom)
{
	var targets = myRoom.find(FIND_CONSTRUCTION_SITES);//TODO: FIX THIS
    if(targets == undefined)
    {
		return 0;
    }
    if(Array.isArray(targets)){
        return targets;
    }
    else{
    return [targets];
    }
}

function findRepairTarget(myRoom)
{
    //TODO: fix this as well, need a way to select walls and ramparts.
    var targets = myRoom.find(FIND_STRUCTURES, {    
        filter: (s) => 	(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)&& s.hits < s.hitsMax});
    if(targets == undefined)
    {
		return 0;
    }
    if(Array.isArray(targets)){
        return targets;
    }
    else{
    return [targets];
    }
}

//TODO: make this more dynamic
function spawnGeneral(spawnPoint, typeOfSpawn, roomName, max = 13)
{
    var top = Game.spawns[spawnPoint].room.energyCapacityAvailable;
    
    var loop = Math.floor(top/200);
    var i=0;
    var body = [];
	if(max<loop)
	{
		loop=max;
	}
	if(Game.spawns[spawnPoint].room.energyAvailable < loop*200)
	{
	    //console.log('Failed to spawn: '+typeOfSpawn + 'in '+roomName+ ' room has: ' +Game.spawns[spawnPoint].room.energyAvailable + ' / ' +Game.spawns[spawnPoint].room.energyCapacityAvailable + ' seeking: ' + loop*250);
	    return;
	}
    while(i<loop)
    {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
        i++;
        //console.log('looped once: ' + i);
    }
	var name = Game.spawns[spawnPoint].createCreep( body, undefined,{role:typeOfSpawn, myRoom: myRoom.name} );
	console.log('Spawning: '+typeOfSpawn+ ', ' + name + ' size: ' + loop);
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

/*
function findTarget(myRoom)
{
    var repairTarget = myRoom.find(FIND_STRUCTURES, {    
        filter: (s) => 	(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART)&& s.hits < s.hitsMax});
        
    if(repairTarget!= undefined)
    {
        //console.log(repairTarget);
        creep.memory.repairTarget = repairTarget.id;
    }
    else
    {
        var repairTarget = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
        		return ((s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) && (s.hits < s.hitsMax));
        	}
        });
        if(repairTarget.length > 0){
            var i=0;
            creep.memory.repairTarget = repairTarget[0].id;
            var target = Game.getObjectById(creep.memory.repairTarget);
            while(i<repairTarget.length)
            {
                if(repairTarget[i] != undefined && target.hits>repairTarget[i].hits)
                {
                	creep.memory.repairTarget = repairTarget[i].id;
                	target = repairTarget[i];
                }
                i++;
            }
            console.log('Repairing Walls :' + creep.memory.repairTarget);
        }
        else
        {
            //console.log('no valid repair targets found, please check code');
        }
    }

}
*/

module.exports = runRoom;
