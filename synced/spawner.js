
var spawner = {
    
    run: function(myRoom, mySpawns, myCreepCount, totalCreeps) {

        var MaxHarvester = 6;
        var MaxBuilder = 2;
        var MaxMule = 1;
        var MaxUpgrader = 20;

        var totalEnergy = Math.floor((Room.energyCapacityAvailable - 100) / 50);
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
                if(myCreepCount.harvester < MaxHarvester  && myRoom.energyAvailable >= referenceHarvesterEnergy)
                {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(harvesterPartArray, newName, {memory:{role:'harvester'}});
                    console.log('Spawning: low '+ newName);
                    continue;
                }
                if(myCreepCount.builder < MaxBuilder && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Builder' + Game.time;
                    Spawn.spawnCreep(partArray, newName, {memory:{role:'builder'}});
                    console.log('Spawning: low '+ newName);
                    continue
                }
                if(myCreepCount.mule < MaxMule && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(partArray, newName, {memory: {role:'mule'}});
                    console.log('Spawning: low '+ newName);
                    continue;
                }
                if(myCreepCount.upgrader < MaxUpgrader && myRoom.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(partArray, newName, {memory: {role:'upgrader'}});
                    console.log('Spawning: low '+ newName);
                }
            }
            if(myCreepCount.harvester < 2)//just in case, if there are no harvesters spawn a harvester
            {
                Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {memory:{role:'harvester'}});
            }
        });
    },
}

module.exports = spawner;
