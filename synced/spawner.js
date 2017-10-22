
var spawner = {
    
    run: function(Room, Spawns, myCreeps) {

        var MaxHarvester = 6;
        var MaxBuilder = 2;
        var MaxMule = 1;
        var MaxUpgrader = 20;

        var totalEnergy = Math.floor((Room.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = totalEnergy * 50
        var workarray = [];
        while (totalEnergy >= 4) {
            totalEnergy -= 4
            workarray.push(WORK)
            workarray.push(MOVE)
            workarray.push(CARRY)
        }
        referenceEnergy -= totalEnergy * 50

        Spawns.forEach(Spawn => {
            if (!Spawn.spawning)
            {
                if(myCreeps.harvester < MaxHarvester  && Room.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(workarray, newName, {memory:{role:'harvester'}});
                    console.log('Spawning: low '+ newName);
                }
                else
                {
                    if(myCreeps.builder < MaxBuilder && Room.energyAvailable >= referenceEnergy)
                    {
                        var newName = 'Builder' + Game.time;
                        Spawn.spawnCreep(workarray, newName, {memory:{role:'builder'}});
                        console.log('Spawning: low '+ newName);
                    }
                    else
                    {
                        if(myCreeps.mule < MaxMule && Room.energyAvailable >= referenceEnergy)
                        {
                            var newName = 'Mule' + Game.time;
                            Spawn.spawnCreep(workarray, newName, {memory: {role:'mule'}});
                            console.log('Spawning: low '+ newName);
                        }
                        else
                        {
                            if(myCreeps.upgrader < MaxUpgrader && Room.energyAvailable >= referenceEnergy)
                            {
                                var newName = 'Upgrader' + Game.time;
                                Spawn.spawnCreep(workarray, newName, {memory: {role:'upgrader'}});
                                console.log('Spawning: low '+ newName);
                            }
                        }
                    }
                }
            }
            if(myCreeps.harvester < 2)//just in case, if there are no harvesters spawn a harvester
            {
                Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {memory:{role:'harvester'}});
            }
        });
    },
}

module.exports = spawner;
