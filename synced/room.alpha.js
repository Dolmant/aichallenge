var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleMule = require('role.mule');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleThief = require('role.thief');

var spawner = require('spawner');

var runRoom = {

    run: function(myRoom) {
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

        runTowers(myTowers);

        var myCreepCount = {
            'harvester': 0,
            'upgrader': 0,
            'builder': 0,
            'mule': 0,
            'claim': 0,
            'thief': 0,
        };
        var totalCreeps = 0;

        myCreeps.forEach(creep => {
            totalCreeps += 1;
            var creep_size = creep.body.filter(part => part == WORK).length;
            switch(creep.memory.role){
                default:
                case 'harvester':
                    roleHarvester.run(creep);
                    myCreepCount.harvester += creep_size;
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    myCreepCount.upgrader += creep_size;
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    myCreepCount.builder += creep_size;
                    break;
                case 'mule':
                    roleMule.run(creep);
                    myCreepCount.mule += creep.body.filter(part => part == CARRY).length;;
                    break;
                case 'claimer':
                    roleClaimer.run(creep);
                    myCreepCount.claim += creep.body.filter(part => part == CLAIM).length;;
                    break;
                case 'thief':
                    roleThief.run(creep);
                    myCreepCount.thief += creep_size;
                    break;
            }
        });
        myRoom.memory.hasMules = myCreepCount.mule;
        spawner.run(myRoom, mySpawns, myCreepCount, totalCreeps);
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
            var structureList = tower.room.find(FIND_STRUCTURES, {filter: s=>
                s.structureType == STRUCTURE_RAMPART ||
                s.structureType == STRUCTURE_WALL ||
                s.structureType == STRUCTURE_ROAD ||
                s.structureType == STRUCTURE_CONTAINER
            });
            for (let structure of structureList)
            {
                if (structure.hits < structure.hitsMax && structure.hits < minRepair)//this could be a problem during an assault where towers start repairing instead of attacking.
                {
                    tower.repair(structure);
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
    if (myRoom.memory.timer % 300 == 0) {
        // TODO Make this equal to the amount of energy in the room, not hardcoded
        myRoom.memory.energyRation == 2000;
    }
    if (myRoom.memory.timer % 1000 == 0) {
        var links = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            },
        });

        var storage = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            },
        });

        myRoom.memory.hasStorage = storage.length > 0;
        myRoom.memory.hasLinks = links.length > 1;

        Game.notify('One thousand ticks: ' + myRoom.memory.timer);
        
        // This function will update stuff like functional roads, etc. Runs every 1K ticks, will have to break this up or store the paths. commented out because I am not using it
        // myRoom.find(FIND_SOURCES).forEach(Source => {
        //     mySpawns.forEach(Spawn => {
        //         findPath(Source.pos, Spawn.pos, {ignoreCreeps: true,}).forEach(pathStep => {
        //             lookForAt(LOOK_STRUCTURES, pathStep.x, pathStep.y).forEach(structure => {
        //                 if (structure.structureType != STRUCTURE_ROAD) {
        //                     myRoom.memory.roadsPresent = false;
        //                     return false;
        //                 }
        //             });
        //         });
        //     });
        // });
        // myRoom.memory.roadsPresent = true;
        // return true;
    }
}

module.exports = runRoom;
