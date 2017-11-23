// @flow

import roleThief from './roles/role.thief';
import roleThiefMule from './roles/role.thiefmule';

const spawner = {
    run: function(myRoom: Room, mySpawns: Array<StructureSpawn>, myCreepCount: myCreepCountType, totalCreeps: number, convert: Creep) {
        var MaxParts = {
            'harvester': 6, // definitely
            'harvesterExtractor': 6,
            'worker': 10,
            'mule': 12,
            'upgrader': 6,
            'thief': 3, //halved for non reserved rez
            'melee': 70,
            'ranged': 70,
            'healer': 10,
            'blocker': 2, //not used current
            'tough': 1,
        }
        var MaxHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 2 : 4;
        var MaxHarvesterExtractorCount = (myRoom.memory.hasContainers && myRoom.memory.hasExtractor) ? 0 : 0 ; //1 : 0;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        var MaxWorkerCount = myRoom.memory.marshalForce ? 1 : 1; //2;
        var MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasExtractor ? 2 : MaxMuleCount;
        var MaxUpgraderCount = myRoom.memory.hasLinks ? 0 : 0;
        var MaxThiefCount = myRoom.memory.marshalForce ? 0 : 17; //17;
        var MaxThiefMuleCount = 11; // 11;
        var MaxMeleeCount = myRoom.memory.marshalForce ? Memory.attackers.forceSize - 3 : 0;
        var MaxRangedCount = myRoom.memory.marshalForce ? 2 : 0;
        var MaxHealerCount = myRoom.memory.marshalForce ? 1 : 0;
        var MaxBlockerCount = myRoom.memory.marshalDisrupter ? 20 : 0;
        var MaxToughCount = myRoom.memory.marshalForce ? 5 : 0;
        var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;


        let canSpawn = true;

        var sourceMapNumber = 99;
        var sourceMap = 0;

        // TODO kill this as this is just a safetycheck
        // if (!myRoom.memory.sources) {myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);}

        myRoom.memory.sources.forEach(source => {
            if ((myCreepCount.sourceMap[source] || 0) < sourceMapNumber) {
                sourceMapNumber = myCreepCount.sourceMap[source] || 0;
                sourceMap = source;
            }
        });

        // mySpawns.forEach(Spawn => {
        const Spawn = mySpawns && mySpawns[0];
        if (Spawn && Spawn.spawning) {
            switch(Game.creeps[Spawn.spawning.name].memory.role) {
                case 'claimer':
                    Memory.misc.globalCreepsTemp.claimer += 1;
                    break;
                case 'thief':
                    Memory.misc.globalCreepsTemp.thief += 1;
                    if (Memory.register_thieves && (creep.memory.sourceMap || creep.memory.tempSourceMap)) {
                        Memory.thieving_spots[creep.memory.sourceMap || creep.memory.tempSourceMap] = creep.name;
                    }
                    break;
                case 'thiefmule':
                    Memory.misc.globalCreepsTemp.thiefmule += 1;
                    break;
                case 'melee':
                    Memory.misc.globalCreepsTemp.melee += 1;
                    break;
                case 'ranged':
                    Memory.misc.globalCreepsTemp.ranged += 1;
                    break;
                case 'healer':
                    Memory.misc.globalCreepsTemp.healer += 1;
                    break;
                case 'blocker':
                    Memory.misc.globalCreepsTemp.blocker += 1;
                    break;
                case 'tough':
                    Memory.misc.globalCreepsTemp.tough += 1;
                    break;
            }
        }
        if (Spawn && !Spawn.spawning && canSpawn) {
            if (Spawn.memory.renewTarget) {
                canSpawn = false;
                var target = Game.getObjectById(Spawn.memory.renewTarget);
                if (target) {
                    var err = Spawn.renewCreep(target);
                    if (err == ERR_FULL || err == ERR_INVALID_TARGET) {
                        delete Spawn.memory.renewTarget;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        // Do something else while we wait for him to get close
                        canSpawn = true;
                        delete Spawn.memory.renewTarget;
                    }
                } else {
                    delete Spawn.memory.renewTarget;
                }
            }
            if(myCreepCount.harvesterParts < MaxParts.harvester * MaxHarvesterCount && myCreepCount.harvesterCount < MaxHarvesterCount && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 1200)  && canSpawn)
            {
                var newName = 'Harvester' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.harvester, {'harvester': true}), newName, {
                    memory: {
                        'role': 'harvester',
                        'myTask': 'harvest',
                        'sourceMap': sourceMap,
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.harvesterCount < 1 && myCreepCount.harvesterLowCount < 1 && canSpawn && myRoom.energyAvailable >= 200)//just in case, if there are no harvesters spawn a harvester
            {
                var newName = 'HarvesterLow' + Game.time;
                Spawn.spawnCreep(myRoom, Math.floor(myRoom.energyAvailable / 200), {'harvester': true}, newName, {
                    memory: {
                        'role': 'harvesterLow',
                        'myTask': 'harvest',
                        'tempSourceMap': sourceMap,
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            // to kickstart a claimer, set room.memory.spawnClaimer and the target ID as room.memory.claimTarget
            if(myRoom.memory.spawnClaimer > 0 && myRoom.energyAvailable >= 700 && canSpawn)
            {
                var newName = 'Claimer' + Game.time;
                Spawn.spawnCreep([CLAIM, MOVE, MOVE], newName, {
                    memory: {
                        'role': 'claimer',
                        'myTask': null, //generate a target from the claimer role
                    },
                });
                console.log('Spawning: '+ newName);
                myRoom.memory.spawnClaimer -= 1;
                canSpawn = false;
            }
            if(myCreepCount.workerParts < MaxParts.worker * MaxWorkerCount && myCreepCount.workerCount < MaxWorkerCount && myCreepCount.muleCount >= MaxMuleCount/2 && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 2000) && canSpawn)
            {
                var newName = 'Worker' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.worker, {'worker': true}), newName, {
                    memory: {
                        'role': 'worker',
                        'myTask': 'resupply',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if (convert && myCreepCount.harvesterCount < 2 && canSpawn && myRoom.energyAvailable <= referenceEnergy * 0.75) {
                convert.memory.role = 'harvester';
                convert.memory.sourceMap = sourceMap;
                canSpawn = false;
            }
            if (myCreepCount.muleParts < MaxParts.mule * MaxMuleCount && myCreepCount.muleCount < MaxMuleCount && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 1500)  && canSpawn)
            {
                var newName = 'Mule' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, {'carryOnly': true}), newName, {
                    memory: {
                        'role': 'mule',
                        'myTask': 'fetch',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if (myCreepCount.upgraderParts < MaxUpgraderCount && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'Upgrader' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.upgrader), newName, {
                    memory: {
                        'role': 'upgrader',
                        'myTask': 'resupply',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if (myCreepCount.harvesterExtractorParts < MaxParts.harvesterExtractor * MaxHarvesterExtractorCount && myCreepCount.harvesterExtractorCount < MaxHarvesterExtractorCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'HarvesterExtractor' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.harvesterExtractor, {'harvester': true}), newName, {
                    memory: {
                        'role': 'harvesterExtractor',
                        'myTask': 'harvestMinerals',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if (myCreepCount.thiefParts < MaxParts.thief * MaxThiefCount && Memory.misc.globalCreeps.thief < MaxThiefCount && (Memory.misc.globalCreeps.thiefmule > (Memory.misc.globalCreeps.thief / 2)) && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'Thief' + Game.time;
                var target = roleThief.generateStealTarget();
                Spawn.spawnCreep(getBody(myRoom, MaxParts.thief, {'thief': true}), newName, {
                    memory: {
                        'role': 'thief',
                        'sourceMap': target,
                        'myTask': 'moveToObject',
                        'moveToObject': target,
                        'moveToObjectRange': 1,
                    },
                });
                Memory.misc.globalCreeps.thief += 1;
                Memory.misc.globalCreepsTemp.thief += 1;
                Memory.thieving_spots[target] = newName;
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if (Memory.misc.globalCreeps.thiefmule < MaxThiefMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                var newName = 'ThiefMule' + Game.time;
                var targets = roleThiefMule.generateHaulTargets();
                var target_room = targets[0];
                var home = targets[1];
                Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, {'carryOnly': true}), newName, {
                    memory: {
                        'role': 'thiefmule',
                        'myTask': 'goToTarget',
                        'goToTarget': target_room,
                        'stealTarget': target_room,
                        'home': home,
                    },
                });
                Memory.misc.globalCreeps.thiefmule += 1;
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.meleeParts < (MaxParts.melee * MaxMeleeCount) && Memory.misc.globalCreeps.melee < MaxMeleeCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                var newName = 'Melee' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.melee, {'melee': true}), newName, {
                    memory: {
                        'role': 'melee',
                        'myTask': 'gather',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.healerParts < (MaxParts.healer * MaxHealerCount) && Memory.misc.globalCreeps.healer < MaxHealerCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                var newName = 'Healer' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.healer, {'healer': true}), newName, {
                    memory: {
                        'role': 'healer',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.rangedParts < (MaxParts.ranged * MaxRangedCount) && Memory.misc.globalCreeps.ranged < MaxRangedCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'Ranged' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.ranged, {'ranged': true}), newName, {
                    memory: {
                        'role': 'ranged',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.blockerParts < (MaxParts.blocker * MaxBlockerCount) && Memory.misc.globalCreeps.blocker < MaxBlockerCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'Blocker' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.blocker, {'blocker': true}), newName, {
                    memory: {
                        'role': 'blocker',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myCreepCount.toughParts < MaxParts.tough * MaxToughCount && Memory.misc.globalCreeps.tough < MaxToughCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
            {
                var newName = 'Tough' + Game.time;
                Spawn.spawnCreep(getBody(myRoom, MaxParts.tough, {'tough': true}), newName, {
                    memory: {
                        'role': 'tough',
                    },
                });
                console.log('Spawning: '+ newName);
                canSpawn = false;
            }
            if(myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                completeOutstandingRequests(myRoom, Spawn);
            }
        }
    },
}

function completeOutstandingRequests(myRoom, Spawn) {
    if (myRoom.memory.requests && myRoom.memory.requests.length) {
        var newName = myRoom.memory.requests[0].role + Game.time;
        const options = {};
        options[myRoom.memory.requests[0].role] = true;
        Spawn.spawnCreep(getBody(myRoom, 50, options), newName, {
            memory: myRoom.memory.requests[0],
        });
        if (myRoom.memory.requests[0].squad) {
            Memory.squads[myRoom.memory.requests[0].squad].creeps.push(newName);
        }
        myRoom.memory.requests.splice(0, 1);
        console.log('Spawning: '+ newName);
    }
}

type getBodyoptions = {
    harvester?: boolean,
    carryOnly?: boolean,
    tough?: boolean,
    blocker?: boolean,
    melee?: boolean,
    healer?: boolean,
    ranged?: boolean,
    worker?: boolean,
}

function getBody(myRoom, MaxParts: number, options?: getBodyoptions = {}) {
    var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
    var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
    var partArray = [];

    if (options.blocker) {
        partArray.push(TOUGH);
        partArray.push(MOVE);
        return partArray;
    }
    if (options.tough) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 130)/70) && i < MaxParts - 1); i += 1) {
            partArray.push(TOUGH);
            partArray.push(TOUGH);
            partArray.push(MOVE);
        }
        partArray.push(MOVE);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.brains) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 130)/70) && i < MaxParts - 1); i += 1) {
            partArray.push(TOUGH);
            partArray.push(TOUGH);
            partArray.push(MOVE);
        }
        partArray.push(MOVE);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.melee) {
        for (var i = 0; (totalEnergy >= 3 && i < MaxParts); i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
            totalEnergy -= 3;
        }
        return partArray;
    }
    if (options.healer) {
        for (var i = 0; (totalEnergy >= 6 && i < MaxParts); i += 1) {
            partArray.push(HEAL);
            partArray.push(MOVE);
            totalEnergy -= 6;
        }
        return partArray;
    }
    if (options.ranged) {
        for (var i = 0; (totalEnergy >= 4 && i < MaxParts); i += 1) {
            partArray.push(RANGED_ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    let workCount = 0;
    if ((options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers)) {
        totalEnergy -= 1;
        partArray.push(CARRY)
        while (totalEnergy >= 3 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(MOVE);
            totalEnergy -= 3;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts) {
                partArray.push(WORK)
                partArray.push(WORK)
                workCount += 2;
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    if (options.thief) {
        partArray.push(CARRY);
        totalEnergy -= 1;
        while (totalEnergy >= 3 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(MOVE);
            totalEnergy -= 3;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts) {
                partArray.push(WORK)
                partArray.push(WORK)
                workCount += 2;
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    if (options.harvester) {
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
        }
        return partArray;
    }
    if (options.worker) {
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts) {
                partArray.push(WORK)
                totalEnergy -= 2;
                workCount += 1;
            }
        }
        return partArray;
    }
    while (totalEnergy >= 4  && workCount < MaxParts) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            partArray.push(CARRY);
            totalEnergy -= 3;
        }
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 2;
        workCount += 1;
    }
    return partArray;
}

export default spawner;
