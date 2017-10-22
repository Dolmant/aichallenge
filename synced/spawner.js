
var spawner = {
    
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps) {

        var MaxHarvester = 6;
        var MaxBuilder = 2;
        var MaxMule = 1;
        var MaxUpgrader = 20;

        var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var totalHarvesterEnergy = totalEnergy;
        var referenceEnergy = totalEnergy * 50
        var referenceHarvesterEnergy = totalEnergy * 50
        var partArray = [];
        var harvesterPartArray = [];

        while (totalEnergy >= 4) {
            totalEnergy -= 4
            partArray.push(WORK)
            partArray.push(MOVE)
            partArray.push(CARRY)
        }

        referenceEnergy -= totalEnergy * 50;

        if (myRoom.memory.roadsPresent) {
            totalHarvesterEnergy -= 1;
            harvesterPartArray.push(MOVE);
            while (totalHarvesterEnergy >= 3) {
                totalHarvesterEnergy -= 3;
                harvesterPartArray.push(WORK);
                harvesterPartArray.push(CARRY);
            }
            referenceHarvesterEnergy -= totalHarvesterEnergy * 50;
        } else {
            harvesterPartArray = partArray;
            referenceHarvesterEnergy = referenceEnergy;
        }

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
                if(myCreepCount.harvester < 1)//just in case, if there are no harvesters spawn a harvester
                {
                    Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {memory:{role:'harvester', sourceSelect: myRoom.sourceFlag}});
                }
                if(myCreepCount.harvester < MaxHarvester  && myRoom.energyAvailable >= referenceHarvesterEnergy)
                {
                    var newName = 'Harvester' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(harvesterPartArray, newName, {memory:{role:'harvester', sourceSelect: myRoom.memory.sourceFlag}});
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.builder < MaxBuilder && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Builder' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {memory:{role:'builder', sourceSelect: myRoom.memory.sourceFlag}});
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.mule < MaxMule && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Mule' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {memory: {role:'mule', sourceSelect: myRoom.memory.sourceFlag}});
                    console.log('Spawning: low '+ newName);
                    // skip other loops since break and continue dont work
                    referenceEnergy = 99999;
                }
                if(myCreepCount.upgrader < MaxUpgrader && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Upgrader' + Game.time;
                    myRoom.memory.sourceFlag = (myRoom.memory.sourceFlag - 1) * -1;
                    Spawn.spawnCreep(partArray, newName, {memory: {role:'upgrader', sourceSelect: myRoom.memory.sourceFlag}});
                    console.log('Spawning: low '+ newName);
                }
            }
        });
    },
}

module.exports = spawner;
