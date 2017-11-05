
// @flow
const spawner = {
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps, convert) {
        var MaxParts = {
            'harvester': 6, // definitely
            'worker': 6,
            'mule': 10,
            'upgrader': 6,
            'thief': 6,
            'melee': 70,
            'ranged': 70,
            'healer': 10,
        }
        var MaxHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 2 : 4;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        var MaxWorkerCount = myRoom.memory.marshalForce ? 1 : 4;
        var MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasLinks ? 2 : MaxMuleCount;
        var MaxUpgraderCount = myRoom.memory.hasLinks ? 1 : 1;
        var MaxThiefCount = myRoom.memory.marshalForce ? 0 : 0;
        var MaxMeleeCount = myRoom.memory.marshalForce ? Memory.attackers.forceSize - 3 : 0;
        var MaxRangedCount = myRoom.memory.marshalForce ? 2 : 0;
        var MaxHealerCount = myRoom.memory.marshalForce ? 1 : 0;
        var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
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
                let canSpawn = true;
                if(myCreepCount.harvesterCount < 1)//just in case, if there are no harvesters spawn a harvester
                {
                    Spawn.spawnCreep([WORK, CARRY, MOVE], 'HarvesterLow' + Game.time, {
                        memory: {
                            'role': 'harvester',
                            'sourceMap': sourceMap,
                        },
                    });
                }

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
                if(myCreepCount.harvesterParts < MaxParts.harvester * myCreepCount.harvesterCount && myCreepCount.harvesterCount < MaxHarvesterCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.harvester, {'harvester': true}), newName, {
                        memory: {
                            'role': 'harvester',
                            'sourceMap': sourceMap,
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
                        },
                    });
                    console.log('Spawning: '+ newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if(myCreepCount.workerParts < MaxParts.worker * myCreepCount.workerCount && myCreepCount.workerCount < MaxWorkerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Worker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.worker), newName, {
                        memory: {
                            'role': 'worker',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if (convert && myCreepCount.harvesterCount < 2 && canSpawn) {
                    convert.memory.role = 'harvester';
                    convert.memory.sourceMap = sourceMap;
                    canSpawn = false;
                }
                if(myCreepCount.muleParts < MaxParts.mule * myCreepCount.muleCount && myCreepCount.muleCount < MaxMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, {'carryOnly': true}), newName, {
                        memory: {
                            'role': 'mule',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.upgraderParts < MaxParts.upgrader * myCreepCount.upgraderCount && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.upgrader), newName, {
                        memory: {
                            'role': 'upgrader',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.thiefParts < MaxParts.thief * Memory.misc.globalCreeps.thief && Memory.misc.globalCreeps.thief < MaxThiefCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Thief' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.thief), newName, {
                        memory: {
                            'role': 'thief',
                            'secondaryRole': totalCreeps > 15 ? 'upgrader' : 'harvester',
                        },
                    });
                    console.log('Spawning: '+ newName);
                }
                if(myCreepCount.meleeParts < MaxParts.melee * Memory.misc.globalCreeps.melee && Memory.misc.globalCreeps.melee < MaxMeleeCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Melee' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.melee, {'melee': true}), newName, {
                        memory: {
                            'role': 'melee',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.healerParts < MaxParts.healer * Memory.misc.globalCreeps.healer && Memory.misc.globalCreeps.healer < MaxHealerCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Healer' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.healer, {'healer': true}), newName, {
                        memory: {
                            'role': 'healer',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.rangedParts < MaxParts.ranged * Memory.misc.globalCreeps.ranged && Memory.misc.globalCreeps.ranged < MaxRangedCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
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
                if(myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    completeOutstandingRequests(myRoom, Spawn);
                }
            }
        });
    },
}

function completeOutstandingRequests(myRoom, Spawn) {
    if (Memory.misc.requests.length) {
        var newName = Memory.misc.requests[0].role + Game.time;
        Spawn.spawnCreep(getBody(myRoom), newName, {
            memory: Memory.misc.requests[0],
        });
        Memory.misc.requests.splice(0, 1);
        console.log('Spawning: '+ newName);
    }
}

function getBody(myRoom, MaxParts, options = {}) {
    var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
    var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
    var partArray = [];

    if (options.melee) {
        for (var i = 0; (i < Math.floor(referenceEnergy/130) && i < MaxParts); i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.healer) {
        for (var i = 0; (i < Math.floor(referenceEnergy/300) && i < MaxParts); i += 1) {
            partArray.push(HEAL);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.ranged) {
        for (var i = 0; (i < Math.floor(referenceEnergy/200) && i < MaxParts); i += 1) {
            partArray.push(RANGED_ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    let workCount = 0;
    if (options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount = 1;
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(MOVE);
            totalEnergy -= 4;
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
    while (totalEnergy >= 4  && workCount < MaxParts) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            totalEnergy -= 2;
        }
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 2;
        workCount += 1;
    }
    return partArray;
}

export default spawner;
