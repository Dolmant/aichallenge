
var spawner = {
    
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps) {
        // These all relate to the number of work parts except Mule which is carry
        var MaxHarvesterParts = 18;
        var MaxBuilderParts = 12;
        var MaxMuleParts = 20;
        var MaxUpgraderParts = 24;
        var MaxThiefParts = 70;
        var MaxAttackerParts = 70;
        var MaxHarvesterCount = 5;
        var MaxBuilderCount = 2;
        var MaxMuleCount = myRoom.memory.hasLinks && myRoom.memory.hasStorage ? 2 : 0;
        var MaxUpgraderCount = myRoom.memory.marshallForce ? 0 : 2;
        var MaxThiefCount = myRoom.memory.marshallForce ? 0 : 4;
        var MaxAttackerCount = myRoom.memory.marshallForce ? 8 : 0;
        var totalEnergy2 = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = Math.floor(totalEnergy2 / 4) * 4 * 50;

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
                var sourceMap = 99;
                // TODO kill this as this is just a safetycheck
                // if (!myRoom.memory.sources) {myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);}

                myRoom.memory.sources.forEach(source => {
                    if (myCreepCount.sourceMap[source] < sourceMap) {sourceMap = myCreepCount.sourceMap[source]}
                });
                let canSpawn = true;
                if(myCreepCount.harvester < 1)//just in case, if there are no harvesters spawn a harvester
                {
                    Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {
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
                        }
                    } else {
                        delete Spawn.memory.renewTarget;
                    }
                }
                if(myCreepCount.harvesterParts < MaxHarvesterParts && myCreepCount.harvesterCount < MaxHarvesterCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, {'harvester': true}), newName, {
                        memory: {
                            'role': 'harvester',
                            'sourceMap': sourceMap,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.attackerParts < MaxAttackerParts && myCreepCount.attackerCount < MaxAttackerCount  && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Attacker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, {'attacker': true}), newName, {
                        memory: {
                            'role': 'attacker',
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
                            'claimTarget': myRoom.memory.claimTarget,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if(myCreepCount.builderParts < MaxBuilderParts && myCreepCount.builderCount < MaxBuilderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Builder' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'builder',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.muleParts < MaxMuleParts && myCreepCount.muleCount < MaxMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, {'carryOnly': true}), newName, {
                        memory: {
                            'role': 'mule',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.upgraderParts < MaxUpgraderParts && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'upgrader',
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.thiefParts < MaxThiefParts && myCreepCount.thiefCount < MaxThiefCount && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Thief' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'thief',
                            'secondaryRole': totalCreeps > 15 ? 'upgrader' : 'harvester',
                        },
                    });
                    console.log('Spawning: '+ newName);
                }
            }
        });
    },
}

function getBody(myRoom, options = {}) {
    var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
    var partArray = [];

    if (options.attacker) {
        while (totalEnergy >= 4) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
            totalEnergy -= 4;
        }
        return partArray;
    }
    if (options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        while (totalEnergy >= 4) {
            partArray.push(WORK)
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            if (totalEnergy >= 4) {
                partArray.push(WORK)
                partArray.push(WORK)
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    while (totalEnergy >= 4) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            totalEnergy -= 2;
        }
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 2;
    }
    return partArray;
}

module.exports = spawner;
