// @flow
import * as profiler from './screeps-profiler';

import roleUpgrader from './role.upgrader';
import roleHarvester from './role.harvester';
import roleMule from './role.mule';
import roleWorker from './role.worker';
import roleClaimer from './role.claimer';
import roleThief from './role.thief';
import roleMelee from './role.melee';
import roleRanged from './role.ranged';
import roleHealer from './role.healer';
import type {Creep} from './../flow-typed/Creep';

import spawner from './spawner';


profiler.registerObject(roleUpgrader, 'upgrader');
profiler.registerObject(roleHarvester, 'harvester');
profiler.registerObject(roleMule, 'mule');
profiler.registerObject(roleWorker, 'worker');
profiler.registerObject(roleClaimer, 'claimer');
profiler.registerObject(roleThief, 'thief');
profiler.registerObject(roleMelee, 'melee');
profiler.registerObject(roleRanged, 'ranged');
profiler.registerObject(roleHealer, 'healer');

const Room = {
    run: function(myRoom) {
        if(myRoom.memory.timer == undefined)
        {
            initializeRoomConsts(myRoom);
        }
        else
        {
            myRoom.memory.timer++;
        }
        var myCreeps: Creep = myRoom.find(FIND_MY_CREEPS);
        var mySpawns = myRoom.find(FIND_MY_SPAWNS);

        var myCreepCount = {
            'sourceMap': {},
            'harvesterParts': 0,
            'upgraderParts': 0,
            'workerParts': 0,
            'muleParts': 0,
            'claimParts': 0,
            'thiefParts': 0,
            'meleeParts': 0,
            'rangedParts': 0,
            'healerParts': 0,
            'harvesterCount': 0,
            'upgraderCount': 0,
            'workerCount': 0,
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
                case 'worker':
                    myCreepCount.workerParts += creep_size;
                    myCreepCount.workerCount += 1;
                    break;
                case 'mule':
                    myCreepCount.muleParts += creep.body.filter(part => part.type == CARRY).length;
                    myCreepCount.muleCount += 1;
                    break;
                case 'claimer':
                    myCreepCount.claimParts += creep.body.filter(part => part.type == CLAIM).length;
                    Memory.misc.globalCreepsTemp.claimer += 1;
                    break;
                case 'thief':
                    myCreepCount.thiefParts += creep_size;
                    Memory.misc.globalCreepsTemp.thief += 1;
                    break;
                case 'melee':
                    myCreepCount.meleeParts += creep.body.filter(part => part.type == ATTACK).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.melee += 1;
                    }
                    break;
                case 'ranged':
                    myCreepCount.rangedParts += creep.body.filter(part => part.type == RANGED_ATTACK).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.ranged += 1;
                    }
                    break;
                case 'healer':
                    myCreepCount.healerParts += creep.body.filter(part => part.type == HEAL).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.healer += 1;
                    }
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
                // legacy, remove
                case 'builder':
                case 'worker':
                    roleWorker.run(creep);
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

        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);

        updateRoomConsts(myRoom);

        runTowers(myTowers);

        transferLinks(myRoom.memory.links);

        myRoom.memory.hasMules = myCreepCount.muleCount;
        spawner.run(myRoom, mySpawns, myCreepCount, totalCreeps);
	}
}

function runTowers(myTowers)
{
    myTowers.forEach(tower => {
        var minRepair = 20000;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
        else if (tower.energy > tower.energyCapacity / 2) {
            var repairTarget = 0;
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
            if (creepToRepair != undefined) {
                tower.heal(creepToRepair);
                repairTarget = creepToRepair;
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, {filter: s=>
                    s.structureType == STRUCTURE_ROAD ||
                    s.structureType == STRUCTURE_CONTAINER
                });
                for (let structure of structureList) {
                    if (structure.hits < structure.hitsMax) {
                        tower.repair(structure);
                        repairTarget = structure.id;
                        break;
                    }
                }
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, {filter: s=>
                    s.structureType == STRUCTURE_RAMPART ||
                    s.structureType == STRUCTURE_WALL
                });
                for (let structure of structureList) {
                    if (structure.hits < structure.hitsMax && structure.hits < minRepair) {
                        tower.repair(structure);
                        repairTarget = structure.id;
                        break;
                    }
                }
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
    myRoom.memory.marshalForce = false;
    myRoom.memory.spawnClaimer = 0;
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if (Memory.methods.createRemoteWorkers) {
        Memory.methods.createRemoteWorkers -= 1;
        Memory.misc.requests.push({
            'role': 'worker',
            'myTask': 'goToTarget',
            'goToTarget': 'W41N51'
        });
    }
    if ((myRoom.memory.timer % 300) == 0 || myRoom.memory.runUpdate) {
        myRoom.memory.runUpdate = false;
        // TODO Make this equal to the amount of energy in the room, not hardcoded
        // TODO this isnt triggering. hardcode trigger in spawn? WHY DOESNT THIS SET
        console.log('ration time: ' + String(myRoom.memory.timer));
        console.log('ration room: ' + String(myRoom.name));
        console.log('ration update: ' + String(myRoom.memory.energyRation));
        myRoom.memory.energyRation = 5000;
        myRoom.memory.structures = {};
        console.log('ration update: ' + String(myRoom.memory.energyRation));
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

export default Room;
