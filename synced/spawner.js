
var spawner = {
    
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps) {

        var MaxHarvester = 6;
        var MaxBuilder = 2;
        var MaxMule = 0;
        var MaxUpgrader = 20;

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

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
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
                if(myRoom.memory.spawnClaimer > 1 && myRoom.energyAvailable >= 700)
                {
                    var newName = 'Claimer' + Game.time;
                    Spawn.spawnCreep([CLAIM, MOVE, MOVE], newName, {
                        memory: {
                            role: 'claimer',
                            claimTarget: myRoom.memory.claimTarget,
                        },
                    });
                    myRoom.memory.spawnClaimer -= 1;
                    referenceEnergy = 99999;
                }
                if(myCreepCount.harvester < MaxHarvester && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Harvester' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory:{
                            role: 'harvester',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.builder < MaxBuilder && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Builder' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'builder',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.mule < MaxMule && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Mule' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'mule',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.upgrader < MaxUpgrader && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Upgrader' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {
                        memory: {
                            role: 'upgrader',
                            sourceSelect: myRoom.memory.sourceFlag,
                        },
                    });
                    console.log('Spawning: low '+ newName);
                }
            }
        });
    },
}

module.exports = spawner;
