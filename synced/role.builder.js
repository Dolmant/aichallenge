/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.fixer');
 * mod.thing == 'a thing'; // true
 */
var roleUpgrader = require('role.upgrader');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
		
		//let people know if we're dying, it's just polite
        if(creep.ticksToLive<10){
            creep.say('Dying ' + creep.ticksToLive);
            //TODO: respawn queu
        }
		
		//if fatigue is run out, dont do anything
        if(creep.fatigue!=0){
		    return;
		}
		//AI state
		
		if((creep.memory.MyTask != 'harvest') && creep.carry.energy == 0){
    		creep.memory.MyTask = 'harvest';
		}
		if(creep.memory.MyTask == 'harvest' && creep.carry.energy == creep.carryCapacity)
		{
			creep.memory.MyTask = 'build';
		}
		switch(creep.memory.MyTask){
		case 'harvest':
			//hungry, go eat
            getEnergy(creep);
			break;
		case 'upgrade':
			roleUpgrader.run(creep);
		case 'repair':
		case 'build':
			//do I already have something to build? If not find something to fix and say fixit
			if(!creep.memory.myBuildTarget && !creep.memory.myRepairTarget)
			{
                findBuildTarget(creep);
                if(!creep.memory.myBuildTarget)
                {
					findRepairTarget(creep);
                }
				if (!creep.memory.myRepairTarget) {
					creep.memory.MyTask = 'upgrade';
				}
			}
			else
			{
				if (creep.memory.myBuildTarget) {
					var target = Game.getObjectById(creep.memory.myBuildTarget);
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else if (creep.memory.myRepairTarget) {
					var target = Game.getObjectById(creep.memory.myRepairTarget);
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
					if (target.hits == target.hitsMax) {
						findRepairTarget(creep);
					}
				}
			}
			break;
		default:
			console.log('agent: ' + creep.name + " the builder did not have an action.");
			creep.memory.MyTask = 'harvest';
			break;
		}
    }
};
function getEnergy(creep)
{
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) && (structure.store.energy > creep.carryCapacity-creep.carry.energy);
            }
    });
    if(target) {
        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
    else
    {
		var source = creep.pos.findClosestByPath(FIND_SOURCES);
        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            creep.say('harvest');
        }
    }
}

function findBuildTarget(creep)
{
	var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(targets != undefined)
    {
		creep.memory.myBuildTarget = targets.id;
    }
}

function findRepairTarget(creep)
{
	var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) =>
			(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax
	});

    if(targets != undefined)
    {
		creep.memory.myRepairTarget = targets.id;
    }
}


module.exports = roleBuilder;