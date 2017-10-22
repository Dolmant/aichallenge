var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleMule = require('role.mule');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleThief = require('role.thief');

var spawner = require('spawner');

var runRoom = {

    run: function(myRoom) {
        //TODO: search the room and find my towers.

        var myCreeps = myRoom.find(FIND_MY_CREEPS);
        var mySpawns = myRoom.find(FIND_MY_SPAWNS);
        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);
        if(myRoom.memory.timer == undefined)
        {
            initializeRoomConsts(myRoom);
        }
        else
        {
            myRoom.memory.timer++;
        }
        updateRoomConsts(myRoom);
        // this doesnt work
        // var tower_test = Room.find(STRUCTURE_TOWER);
        // console.log(tower_test);
        //TODO: make the towers dynamic
        //myTowers = myRoom.find(STRUCTURE_TOWER);
        runTowers(myTowers);

        var myCreepCount = {
            harvester: 0,
            upgrader: 0,
            builder: 0,
            mule: 0,
            claim: 0,
            thief: 0,
        };
        var totalCreeps = 0;

        myCreeps.forEach(creep => {
            totalCreeps += 1;
            switch(creep.memory.role){
                default:
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
                case 'claimer':
                    roleClaimer.run(creep);
                    myCreepCount.claim += 1;
                    break;
                case 'thief':
                    roleThief.run(creep);
                    myCreepCount.thief += 1;
                    break;
            }
        })
        spawner.run(myRoom, mySpawns, myCreepCount, totalCreeps)
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

function runTowers(myTowers)
{
    myTowers.forEach(tower => {
        var minRepair = 100000;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else
        {
            var rampRepair = tower.room.find(FIND_STRUCTURES, {filter: s=>
                s.structureType == STRUCTURE_RAMPART ||
                s.structureType == STRUCTURE_WALL ||
                s.structureType == STRUCTURE_ROAD ||
                s.structureType == STRUCTURE_CONTAINER
            });
            for (let ramps of rampRepair)
            {
                if(ramps.hits < minRepair)//this could be a problem during an assault where towers start repairing instead of attacking.
                {
                    tower.repair(ramps);
                    break;
                }
            }
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
            if (creepToRepair != undefined)
            {
                tower.heal(creepToRepair);
            }
            
        }
    });
}

function initializeRoomConsts(myRoom) {
    // TODO create the methods that scout adjacent rooms, which exit is better to steal from, etc
    myRoom.memory.timer = 0;
}

function updateRoomConsts(myRoom, mySpawns) {
    // This function will update stuff like functional roads, etc. Runs every 1K ticks, will have to break this up or store the paths
    if (myRoom.memory.timer % 0 == 0) {
        myRoom.find(FIND_SOURCES).forEach(Source => {
            mySpawns.forEach(Spawn => {
                findPath(Source.pos, Spawn.pos, {ignoreCreeps: true,}).forEach(pathStep => {
                    lookForAt(LOOK_STRUCTURES, pathStep.x, pathStep.y).forEach(structure => {
                        if (structure.structureType != STRUCTURE_ROAD) {
                            myRoom.memory.roadsPresent = false;
                            return false;
                        }
                    });
                });
            });
        });
        myRoom.memory.roadsPresent = true;
        return true;
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
