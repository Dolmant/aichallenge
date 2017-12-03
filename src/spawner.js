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
        const MaxHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 2 : 4;
        const MaxHarvesterExtractorCount = (myRoom.memory.hasContainers && myRoom.memory.hasExtractor) ? 0 : 0 ; //1 : 0;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        let MaxWorkerCount = 2;
        if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] > 800000) {
            MaxWorkerCount = 4;
        } else if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] > 500000) {
            MaxWorkerCount = 3;
        } else if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] < 100000) {
            MaxWorkerCount = 1;
        }
        
        let MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasExtractor ? 2 : MaxMuleCount;

        let canSpawn = true;

        let sourceMapNumber = 99;
        let sourceMap = 0;

        mySpawns.forEach(Spawn => {
            if (Spawn && Spawn.spawning) {
                switch(Game.creeps[Spawn.spawning.name].memory.role) {
                    case 'claimer':
                        Memory.misc.globalCreepsTemp.claimer += 1;
                        break;
                    case 'harvester':
                        myCreepCount.harvesterCount += 1;
                        myCreepCount.sourceMap[Game.creeps[Spawn.spawning.name].memory.sourceMap] = 1 + (myCreepCount.sourceMap[Game.creeps[Spawn.spawning.name].memory.sourceMap] || 0);
                        break;
                    case 'worker':
                        myCreepCount.workerCount += 1;
                        break;
                    case 'harvesterExtractor':
                        myCreepCount.harvesterExtractorCount += 1;
                        break;
                    case 'mule':
                        myCreepCount.muleCount += 1;
                        break;
                }
            }
        });

        myRoom.memory.sources.forEach(source => {
            if ((myCreepCount.sourceMap[source] || 0) < sourceMapNumber) {
                sourceMapNumber = myCreepCount.sourceMap[source] || 0;
                sourceMap = source;
            }
        });

        mySpawns.forEach(Spawn => {
            const totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
            const referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
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
                    myCreepCount.sourceMap[sourceMap] += 1;
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
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, {'mule': true}), newName, {
                        memory: {
                            'role': 'mule',
                            'myTask': 'fetch',
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
                if(myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    canSpawn = !completeOutstandingRequests(myRoom, Spawn);
                }
            }
        });
    },
}

function completeOutstandingRequests(myRoom, Spawn) {
    if (myRoom.memory.requests && myRoom.memory.requests.length) {
        var newName = myRoom.memory.requests[0].name || (myRoom.memory.requests[0].role + Game.time + Spawn.name);
        const options = {};
        options[myRoom.memory.requests[0].secondaryRole || myRoom.memory.requests[0].role] = true;
        if (myRoom.memory.requests[0].sourceMap) {
            options['sourceMap'] = myRoom.memory.requests[0].sourceMap;
        }
        const suggestedBody = getBody(myRoom, 50, options);
        const err = Spawn.spawnCreep(suggestedBody, newName, {
            memory: myRoom.memory.requests[0],
        });
        if (err == OK) {
            // TODO if we have a squad but cant find the id, create a retired squad
            if (myRoom.memory.requests[0].squad && Memory.squads[myRoom.memory.requests[0].squad]) {
                Memory.squads[myRoom.memory.requests[0].squad].creeps.push(newName);
            }
            const buildno = Memory.buildQueue.indexOf(newName);
            if (buildno != -1) {
                Memory.buildQueue.splice(buildno, 1);
            }
            myRoom.memory.requests.splice(0, 1);
            console.log('Spawning: '+ newName);
            return true;
        } else {
            console.log(err)
            console.log(suggestedBody.length)
            console.log(newName)
            console.log(JSON.stringify({memory: myRoom.memory.requests[0],}))
            console.log("brains failed to spawn")
            return false;
        }
    }
}

type getBodyoptions = {
    harvester?: boolean,
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
    if (options.defcon) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 400)/50) && i < 20); i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.grinder) {
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        for (var i = 0; (i < Math.floor((referenceEnergy - 1040)/50) && i < 42); i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(MOVE);
        return partArray;
    }
    if (options.guard) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 640)/80) && i < 21); i += 1) {
            partArray.push(TOUGH);
            partArray.push(MOVE);
        }
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.farm) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 2170)/50) && i < 25); i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(TOUGH);
        partArray.push(TOUGH);
        partArray.push(RANGED_ATTACK);
        partArray.push(RANGED_ATTACK);
        partArray.push(RANGED_ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
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
    if (options.heal) {
        for (var i = 0; (i < Math.floor((referenceEnergy - 3750)/50) && i < 35); i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
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
        let amount = 3;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 1500) {
            amount = 6;
            if (Memory.energyMap[options.sourceMap] > 3000) {
                amount = 8;
            }
        }
        partArray.push(CARRY);
        totalEnergy -= 1;
        while (totalEnergy >= 3 && workCount < amount) {
            partArray.push(WORK)
            partArray.push(MOVE);
            totalEnergy -= 3;
            workCount += 1;
        }
        return partArray;
    }
    if (options.harvester) {
        while (totalEnergy >= 4 && workCount < 6) {
            partArray.push(WORK)
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
        }
        return partArray;
    }
    if (options.worker) {
        while (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy/300)) {
            partArray.push(WORK)
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy/300)) {
                partArray.push(WORK)
                totalEnergy -= 2;
                workCount += 1;
            }
        }
        return partArray;
    }
    if (options.mule || options.thiefmule) {
        let amount = 6;
        if (options.thiefmule) {
            amount = 6;
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 3000) {
                amount = 15;
            }
        }
        while (totalEnergy >= 4  && workCount < amount) {
            partArray.push(MOVE);
            partArray.push(CARRY);
            partArray.push(CARRY);
            totalEnergy -= 3;
            workCount += 1;
        }
        return partArray;
    }
    while (totalEnergy >= 4  && workCount < 12) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        partArray.push(CARRY);
        totalEnergy -= 5;
        workCount += 1;
    }
    return partArray;
}

export default spawner;
