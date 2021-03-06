// @flow
// import * as profiler from './screeps-profiler';

import roleUpgrader from './roles/role.upgrader';
import roleHarvester from './roles/role.harvester';
import roleMule from './roles/role.mule';
import roleWorker from './roles/role.worker';
import roleClaimer from './roles/role.claimer';
import roleThief from './roles/role.thief';
import roleThiefMule from './roles/role.thiefmule';
import roleOffensive from './roles/role.offensive';

import spawner from './spawner';

import taskManager from './task.manager';

// profiler.registerObject(roleUpgrader, 'upgrader');
// profiler.registerObject(roleHarvester, 'harvester');
// profiler.registerObject(roleMule, 'mule');
// profiler.registerObject(roleWorker, 'worker');
// profiler.registerObject(roleClaimer, 'claimer');
// profiler.registerObject(roleThief, 'thief');
// profiler.registerObject(roleOffensive, 'run');

const RoomController = {
    run: function(myRoom: Room) {
        const SroomInit = Game.cpu.getUsed();
        if(myRoom.memory.timer == undefined) {
            initializeRoomConsts(myRoom);
        }
        else {
            myRoom.memory.timer++;
        }

        var myCreeps: Creep = myRoom.find(FIND_MY_CREEPS);

        var mySpawns = myRoom.find(FIND_MY_SPAWNS);

        var myCreepCount = {
            'sourceMap': {},
            'harvesterParts': 0,
            'harvesterExtractorParts': 0,
            'upgraderParts': 0,
            'workerParts': 0,
            'muleParts': 0,
            'claimParts': 0,
            'thiefParts': 0,
            'meleeParts': 0,
            'rangedParts': 0,
            'healerParts': 0,
            'toughParts': 0,
            'blockerParts': 0,
            'harvesterCount': 0,
            'harvesterLowCount': 0,
            'harvesterExtractorCount': 0,
            'upgraderCount': 0,
            'workerCount': 0,
            'muleCount': 0,
            'claimCount': 0,
            'thiefCount': 0,
            'meleeCount': 0,
            'rangedCount': 0,
            'healerCount': 0,
            'toughCount': 0,
            'blockerCount': 0,
        };

        var totalCreeps = 0;
        myCreeps.forEach(creep => {
            totalCreeps += 1;
            //TODO fix this count
            var creep_size = creep.body.filter(part => part.type == WORK).length;
            myCreepCount.sourceMap[creep.memory.sourceMap] = 1 + (myCreepCount.sourceMap[creep.memory.sourceMap] || 0);
            switch(creep.memory.role){
                default:
                case 'harvesterLow':
                    myCreepCount.harvesterLowCount += 1;
                    break;
                case 'harvester':
                    myCreepCount.harvesterParts += creep_size;
                    myCreepCount.harvesterCount += 1;
                    break;
                case 'harvesterExtractor':
                    myCreepCount.harvesterExtractorParts += creep_size;
                    myCreepCount.harvesterExtractorCount += 1;
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
            }
        });

        Memory.stats['cpu.roomInit_temp'] += Game.cpu.getUsed() - SroomInit;
        // switch(creep.memory.role) {
        //     case 'worker':
        //         creep.memory.myTask = 'resupply';
        //         actResupply.run(creep);
        //         break;
        //     case 'mule':
        //         creep.memory.myTask = 'fetch';
        //         break;
        //     default:
        //         creep.memory.myTask = 'harvest';
        //         break;
        // }
        // break;
        myRoom.memory.myCreepCount = myCreepCount;

        Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] = 0;
        Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'] = 0;
        let rolesCpu = 0;
        
        let convert = null;
        myCreeps.forEach(creep => {
            let cpu = Game.cpu.getUsed();
            if (taskManager.run(creep, mySpawns)) {
                Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] += Game.cpu.getUsed() - cpu;
                rolesCpu = Game.cpu.getUsed();
                switch(creep.memory.role){
                    case 'harvesterLow':
                    case 'harvester':
                        roleHarvester.run(creep);
                        break;
                    case 'harvesterExtractor':
                        roleHarvester.runExtractor(creep);
                        break;
                    case 'upgrader': 
                        roleUpgrader.run(creep);
                        break;
                    case 'remoteWorker': 
                    case 'worker':
                        if (myCreepCount.harvesterCount < 2) {
                            convert = creep;
                        }
                        roleWorker.run(creep);
                        break;
                    case 'mule':
                        roleMule.run(creep);
                        break;
                    case 'reserve':
                        roleClaimer.reserve(creep);
                        break;
                    case 'claimer':
                        roleClaimer.run(creep);
                        break;
                    case 'thief':
                        roleThief.run(creep);
                        break;
                    case 'thiefmule':
                        roleThiefMule.run(creep);
                        break;
                    case 'melee':
                    case 'ranged':
                    case 'healer':
                    case 'blocker':
                    case 'tough':
                        break;
                }
                Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'] += Game.cpu.getUsed() - rolesCpu;
            } else {
                Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] += Game.cpu.getUsed() - cpu;
            }
        });
        Memory.stats['room.' + myRoom.name + '.cpu.taskManager'] = Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'];
        Memory.stats['room.' + myRoom.name + '.cpu.roles'] = Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'];

        if (mySpawns && mySpawns.length > 0 && mySpawns[0].hits < mySpawns[0].hitsMax/2 && myRoom.controller && !myRoom.controller.safeMode && !myRoom.controller.safeModeCooldown && myRoom.controller.safeModeAvailable) {
            myRoom.controller.activateSafeMode();
            // dont waste these!!
		}

        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);
        myRoom.memory.hasMules = myCreepCount.muleCount;

        const SroomUpdateConsts = Game.cpu.getUsed();
        updateRoomConsts(myRoom);
        Memory.stats['cpu.roomUpdateConsts_temp'] += Game.cpu.getUsed() - SroomUpdateConsts;

        const SrunTowers = Game.cpu.getUsed();
        runTowers(myTowers, myRoom);
        Memory.stats['cpu.runTowers_temp'] += Game.cpu.getUsed() - SrunTowers;

        const Slinks  = Game.cpu.getUsed() ;
        transferLinks(myRoom.memory.links);
        Memory.stats['cpu.links_temp'] += Game.cpu.getUsed() - Slinks;

        Memory.stats['room.' + myRoom.name + '.cpu.spawner_temp'] = Game.cpu.getUsed();
        spawner.run(myRoom, mySpawns, myCreepCount, totalCreeps, convert);
        Memory.stats['room.' + myRoom.name + '.cpu.spawner'] = Game.cpu.getUsed() - Memory.stats['room.' + myRoom.name + '.cpu.spawner_temp'];
	}
}

function runTowers(myTowers, myRoom) {
    myTowers.forEach(tower => {
        var minRepair = 100000;
        if (!myRoom.memory.towers) {
            myRoom.memory.towers = {};
        }
        if (!myRoom.memory.towers[tower.id]) {
            myRoom.memory.towers[tower.id] = {};
        }
        if (myRoom.memory.towers[tower.id].attackCreep) {
            var target = Game.getObjectById(myRoom.memory.towers[tower.id].attackCreep)
            if (target && target.pos.roomName === myRoom.name) {
                var err = tower.attack(target);
                if (err == OK) {
                    return;
                }
            }
            myRoom.memory.towers[tower.id].attackCreep = 0;
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 30) {
            myRoom.memory.towers[tower.id].attackCreep = closestHostile.id;
            tower.attack(closestHostile);
        } else if (tower.energy > tower.energyCapacity / 2) {
            var repairTarget = 0;
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
            if (creepToRepair != undefined) {
                tower.heal(creepToRepair);
                repairTarget = creepToRepair;
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, {filter: s=>
                    (s.structureType == STRUCTURE_ROAD ||
                    s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.5
                });
                for (let structure of structureList) {
                    tower.repair(structure);
                    repairTarget = structure.id;
                    break;
                }
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, {filter: s=>
                    (s.structureType == STRUCTURE_RAMPART ||
                    s.structureType == STRUCTURE_WALL) && s.hits < minRepair
                });
                for (let structure of structureList) {
                    tower.repair(structure);
                    repairTarget = structure.id;
                    break;
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
            if (link) {
                if (link.energy > link.energyCapacity - 100) {
                    give.push(link);
                } else if (link.energy == 0) {
                    receive.push(link);
                }
            }
            // TODO DELETE DEAD LINKS
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
    myRoom.memory.requests = [];
    myRoom.memory.marshalForce = false;
    myRoom.memory.runUpdate = false;
    myRoom.memory.spawnClaimer = 0;
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if (Memory.methods.createRemoteWorkers) {
        Memory.methods.createRemoteWorkers -= 1;
        myRoom.memory.requests.push({
            'role': 'worker',
            'myTask': 'goToTarget',
            'goToTarget': 'W46N52'
        });
    }
    if ((myRoom.memory.timer % 300) == 0 || myRoom.memory.runUpdate) {
        // TODO REMVOE THIS MECHANIC
        // TODO this isnt triggering. hardcode trigger in spawn? WHY DOESNT THIS SET
        myRoom.memory.energyRation = 5000;
        myRoom.memory.structures = {};
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

        var extractor = myRoom.find(FIND_STRUCTURES, {
            'filter': (structure) => {
                return (structure.structureType == STRUCTURE_EXTRACTOR);
            },
        });

        myRoom.memory.links = links.map(link => link.id);

        myRoom.memory.hasStorage = storage.length > 0;
        myRoom.memory.hasContainers = container.length > 0;
        myRoom.memory.hasLinks = links.length > 1;
        myRoom.memory.hasExtractor = extractor.length > 0;
        
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

export default RoomController;
