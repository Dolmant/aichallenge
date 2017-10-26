/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.fixer');
 * mod.thing == 'a thing'; // true
 */
var actUpgrade = require('action.upgrade');
var actResupply = require('action.resupply');
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.fatigue != 0){
			return;
		}
		
	
		if((creep.memory.myTask != 'resupply') && creep.carry.energy == 0){
    		creep.memory.myTask = 'resupply';
		}
		if(creep.memory.myTask == 'resupply' && creep.carry.energy == creep.carryCapacity)
		{
			creep.memory.myTask = 'build';
		}
		switch(creep.memory.myTask){
		case 'resupply':
			//hungry, go eat
            actResupply.run(creep);
			break;
		case 'upgrade':
			actUpgrade.run(creep);
			break;
		case 'repair':
		case 'build':
			//do I already have something to build? If not find something to fix and say fixit
			if(!creep.memory.myBuildTarget && !creep.memory.myRepairTarget)
			{
                findBuildTarget(creep);
                if(!creep.memory.myBuildTarget)
                {
					findRepairTarget(creep);
					if (!creep.memory.myRepairTarget) {
						creep.memory.myTask = 'upgrade';
					}
                }
			}
			else
			{
				if (creep.memory.myBuildTarget) {
					var target = Game.getObjectById(creep.memory.myBuildTarget);
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
					if (!target) {
						findBuildTarget(creep);
					}
				} else if (creep.memory.myRepairTarget) {
					var target = Game.getObjectById(creep.memory.myRepairTarget);
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
					}
					if (!target || target.hits == target.hitsMax) {
						findBuildTarget(creep);
						findRepairTarget(creep);
					}
				}
			}
			break;
		case 'goToTarget':
			util.goToTarget(creep);
			if (creep.room.name == creep.memory.goToTarget) {
				creep.memory.myTask = 'resupply';
			}
			break;
		default:
			console.log('agent: ' + creep.name + " the builder did not have an action.");
			creep.memory.myTask = 'resupply';
			break;
		}
    }
};

function findBuildTarget(creep)
{
	var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	creep.memory.myBuildTarget = target && target.id;
}

function findRepairTarget(creep)
{
	var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) =>
			(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax
	});

	creep.memory.myRepairTarget = target && target.id;
}


module.exports = roleBuilder;