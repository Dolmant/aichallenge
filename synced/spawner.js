

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMule = require('role.mule');

var spawner = {
    
    run: function(roomName) {

        var MaxHarvester = 6;
        var MaxBuilder = 2;
        var MaxMule = 1;
        var MaxUpgrader = 20;

        var Creeps = Room.find(FIND_MY_CREEPS);
        var tower_test = Room.find(STRUCTURE_TOWER);
        console.log(tower_test);
        console.log(Room.find(FIND_MY_SPAWNS))

        runTower('59b47e88e1065233e38d42ee');

        var MyCreeps = {
            harvester: 0,
            upgrader: 0,
            builder: 0,
            mule: 0,
        };

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
        for(var creep in Creeps) {
            switch(creep.memory.role){
                case 'harvester':
                    roleHarvester.run(creep);
                    MyCreeps.harvester += 1;
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    MyCreeps.upgrader += 1;
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    MyCreeps.builder += 1;
                    break;
                case 'mule':
                    roleMule.run(creep);
                    MyCreeps.mule += 1;
                    break;
                default:
                break;
            }
        }

        if (!Game.spawns['Spawn1'].spawning)
        {
            if(MyCreeps.harvester < MaxHarvester  && Room.energyAvailable >= referenceEnergy)
            {
                var newName = 'Harvester' + Game.time;
                Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory:{role:'harvester'}});
                console.log('Spawning: low '+ newName);
            }
            else
            {
                if(MyCreeps.builder < MaxBuilder && Room.energyAvailable >= referenceEnergy)
                {
                    var newName = 'Builder' + Game.time;
                    Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory:{role:'builder'}});
                    console.log('Spawning: low '+ newName);
                }
                else
                {
                    if(MyCreeps.mule < MaxMule && Room.energyAvailable >= referenceEnergy)
                    {
                        var newName = 'Mule' + Game.time;
                        Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory: {role:'mule'}});
                        console.log('Spawning: low '+ newName);
                    }
                    else
                    {
                        if(MyCreeps.upgrader < MaxUpgrader && Room.energyAvailable >= referenceEnergy)
                        {
                            var newName = 'Upgrader' + Game.time;
                            Game.spawns['Spawn1'].spawnCreep(workarray, newName, {memory: {role:'upgrader'}});
                            console.log('Spawning: low '+ newName);
                        }
                    }
                }
            }
        }
        if(MyCreeps.harvester < 1)//just in case, if there are no harvesters spawn a harvester
        {
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], 'Harvester', {memory:{role:'harvester'}});
        }
    },
}

function runTower(towerID) {
    var tower = Game.getObjectById(towerID);
    var minRepair = 860000;
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
        else
        {
            
            var rampRepair = tower.room.find(FIND_STRUCTURES, {filter: s=> s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL});
            for (let ramps of rampRepair)
            {
                if(ramps.hits < minRepair)//this could be a problem during an assault where towers start repairing instead of attacking.
                {
                    tower.repair(ramps);
                }
            }
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: c=> c.hits < c.hitsMax});
            if (creepToRepair != undefined)
            {
                tower.heal(creepToRepair);
            }
        }
    }
}

module.exports = spawner;
