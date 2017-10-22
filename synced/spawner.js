
var spawner = {
    
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps) {

        var MaxHarvester = 4;
        var MaxBuilder = 2;
        var MaxMule = 0;
        var MaxUpgrader = 5;
        var MaxThief = 15;

        var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = totalEnergy * 50
        var partArray = [];

        while (totalEnergy >= 4) {
            totalEnergy -= 4
            partArray.push(WORK)
            partArray.push(MOVE)
            partArray.push(CARRY)
        }

        referenceEnergy -= totalEnergy * 50;

        var totalEnergyThief = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergyThief = totalEnergyThief * 50
        var partArrayThief = [];

        while (totalEnergyThief >= 6) {
            totalEnergyThief -= 6
            partArrayThief.push(WORK)
            partArrayThief.push(MOVE)
            partArrayThief.push(MOVE)
            partArrayThief.push(CARRY)
            partArrayThief.push(CARRY)
        }

        referenceEnergyThief -= totalEnergyThief * 50;

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
                let canSpawn = true;
                if(myCreepCount.harvester < 1)//just in case, if there are no harvesters spawn a harvester
                {
                    Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {
                        memory: {
                            role: 'harvester',
                            sourceSelect: 0,
                        },
                    });
                }

                // to kickstart a claimer, set room.memory.spawnClaimer and the target ID as room.memory.claimTarget
                if(myRoom.memory.spawnClaimer > 0 && myRoom.energyAvailable >= 700)
                {
                    var newName = 'Claimer' + Game.time;
                    Spawn.spawnCreep([CLAIM, MOVE, MOVE], newName, {
                        memory: {
                            role: 'claimer',
                            claimTarget: myRoom.memory.claimTarget,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if(myCreepCount.harvester < MaxHarvester && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Harvester' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory:{
                            role: 'harvester',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.builder < MaxBuilder && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Builder' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'builder',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.mule < MaxMule && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Mule' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'mule',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.upgrader < MaxUpgrader && myRoom.energyAvailable >= referenceEnergy && canSpawn)
                {
                    var newName = 'Upgrader' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'upgrader',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: '+ newName);
                    canSpawn = false;
                }
                if(myCreepCount.thief < MaxThief && myRoom.energyAvailable >= referenceEnergyThief && canSpawn)
                {
                    var newName = 'Thief' + Game.time;
                    Spawn.spawnCreep(partArrayThief, newName, {
                        memory: {
                            role: 'thief',
                            secondaryRole: totalCreeps > 15 ? 'upgrader' : 'harvester',
                        },
                    });
                    console.log('Spawning: '+ newName);
                }
            }
        });
    },
}

module.exports = spawner;
