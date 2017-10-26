var roleUpgrader = require('role.upgrader');
var roleHarvester = require('role.harvester');
var roleMule = require('role.mule');
var roleBuilder = require('role.builder');
var roleClaimer = require('role.claimer');
var roleThief = require('role.thief');
var roleMelee = require('role.melee');
var roleRanged = require('role.ranged');
var roleHealer = require('role.healer');

var spawner = require('spawner');

var runRoom = {

    run: function(myRoom) {
        if(myRoom.memory.timer == undefined)
        {
            initializeRoomConsts(myRoom);
        }
        else
        {
            myRoom.memory.timer++;
        }
        var myCreeps = myRoom.find(FIND_MY_CREEPS);
        if (!myRoom.controller || (myRoom.controller && !myRoom.controller.my)) {
            myRoom.memory.owner = myRoom.controller && !!myRoom.controller.owner;

            myCreeps.forEach(creep => {
                if(creep.memory.role == 'thief') {
                    roleThief.run(creep);
                }
            });

            return false;
        }

        if (myRoom.find(FIND_HOSTILE_CREEPS).length > 0 && !myRoom.controller.safeMode && !myRoom.controller.safeModeCooldown && myRoom.controller.safeModeAvailable) {
            // myRoom.controller.activateSafeMode();
            // dont waste these!!
		}

        var mySpawns = myRoom.find(FIND_MY_SPAWNS);
        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);

        updateRoomConsts(myRoom);

        runTowers(myTowers);

        transferLinks(myRoom.memory.links);

        var myCreepCount = {
            'sourceMap': {},
            'harvesterParts': 0,
            'upgraderParts': 0,
            'builderParts': 0,
            'muleParts': 0,
            'claimParts': 0,
            'thiefParts': 0,
            'meleeParts': 0,
            'rangedParts': 0,
            'healerParts': 0,
            'harvesterCount': 0,
            'upgraderCount': 0,
            'builderCount': 0,
            'muleCount': 0,
            'claimCount': 0,
            'thiefCount': 0,
            'meleeCount': 0,
            'rangedCount': 0,
            'healerCount': 0,
        };
        var totalCreeps = 0;
        myCreeps.forEach(creep => {
            totalCreeps += 1;
            //TODO fix this count
            var creep_size = creep.body.filter(part => part.type == WORK).length;
            myCreepCount.sourceMap[creep.memory.sourceMap] = 1 + (myCreepCount.sourceMap[creep.memory.sourceMap] || 0);
            switch(creep.memory.role){
                default:
                case 'harvester':
                    myCreepCount.harvesterParts += creep_size;
                    myCreepCount.harvesterCount += 1;
                    break;
                case 'upgrader':
                    myCreepCount.upgraderParts += creep_size;
                    myCreepCount.upgraderCount += 1;
                    break;
                case 'builder':
                    myCreepCount.builderParts += creep_size;
                    myCreepCount.builderCount += 1;
                    break;
                case 'mule':
                    myCreepCount.muleParts += creep.body.filter(part => part.type == CARRY).length;
                    myCreepCount.muleCount += 1;
                    break;
                case 'claimer':
                    myCreepCount.claimParts += creep.body.filter(part => part.type == CLAIM).length;
                    myCreepCount.claimCount += 1;
                    break;
                case 'thief':
                    myCreepCount.thiefParts += creep_size;
                    myCreepCount.thiefCount += 1;
                    break;
                case 'melee':
                    myCreepCount.meleeParts += creep.body.filter(part => part.type == ATTACK).length;
                    myCreepCount.meleeCount += 1;
                    break;
                case 'ranged':
                    myCreepCount.rangedParts += creep.body.filter(part => part.type == RANGED_ATTACK).length;
                    myCreepCount.rangedCount += 1;
                    break;
                case 'healer':
                    myCreepCount.healerParts += creep.body.filter(part => part.type == HEAL).length;
                    myCreepCount.healerCount += 1;
                    break;
            }
        });

        myRoom.memory.myCreepCount = myCreepCount;
        myCreeps.forEach(creep => {
            switch(creep.memory.role){
                default:
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'mule':
                    roleMule.run(creep);
                    break;
                case 'claimer':
                    roleClaimer.run(creep);
                    break;
                case 'thief':
                    roleThief.run(creep);
                    break;
                case 'melee':
                    roleMelee.run(creep, mySpawns);
                    break;
                case 'ranged':
                    roleRanged.run(creep, mySpawns);
                    break;
                case 'healer':
                    roleHealer.run(creep, mySpawns);
                    break;
            }
        });

        myRoom.memory.hasMules = myCreepCount.muleCount;
        spawner.run(myRoom, mySpawns, myCreepCount, totalCreeps);
	}
}

function runTowers(myTowers)
{
    myTowers.forEach(tower => {
        var minRepair = 10000;
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

function transferLinks(myLinks) {
    // Transer energy to empty links only. Leave 1 energy behind so links transferring dont count as empty
    if (myLinks) {
        var myLinksMapped = myLinks.map(link => Game.getObjectById(link));
        var receive = [];
        var give = [];
        myLinksMapped.forEach(link => {
            if (link.energy > link.energyCapacity - 100) {
                give.push(link);
            } else if (link.energy == 0) {
                receive.push(link);
            }
        });
        var condition = give.length > receive.length ? receive.length : give.length;
        for (var index = 0; index < condition; index += 1) {
            give[index].transferEnergy(receive[index], give[index].energy - 1)
        }
    }
}

function initializeRoomConsts(myRoom) {
    // TODO create the methods that scout adjacent rooms, which exit is better to steal from, etc
    myRoom.memory.timer = 0;
    myRoom.memory.structures = {};
    myRoom.memory.links = [];
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if ((myRoom.memory.timer % 300) == 0 || myRoom.memory.runUpdate) {
        // TODO Make this equal to the amount of energy in the room, not hardcoded
        // TODO this isnt triggering. hardcode trigger in spawn? WHY DOESNT THIS SET
        myRoom.memory.energyRation = 5000;
        myRoom.memory.structures = {};
        console.log('ration update: ' + String(myRoom.memory.energyRation));
        console.log('ration time: ' + String(myRoom.memory.timer));
        console.log('ration room: ' + String(myRoom.name));
    }
    if (myRoom.memory.timer % 1000 == 0 || myRoom.memory.runUpdate) {
        myRoom.memory.runUpdate = false;
        var container = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            },
        });

        var storage = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE);
            },
        });

        var links = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_LINK);
            },
        });

        myRoom.memory.links = links.map(link => link.id);

        myRoom.memory.hasStorage = storage.length > 0;
        myRoom.memory.hasContainers = container.length > 0;
        myRoom.memory.hasLinks = links.length > 1;
        
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
