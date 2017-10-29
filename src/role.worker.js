// @flow
import actUpgrade from './action.upgrade';
import actResupply from './action.resupply';
import util from './util';

const roleWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if(creep.fatigue != 0){
			return;
		}
	
		if((creep.memory.myTask == 'repair' || creep.memory.myTask == 'build' || creep.memory.myTask == 'upgrade') && creep.carry.energy == 0){
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
			if(!creep.memory.myBuildTarget && !creep.memory.myRepairTarget) {
                findBuildTarget(creep);
                if(!creep.memory.myBuildTarget)
                {
					creep.memory.myTask = 'upgrade';
					// towers can repair instead
					// findRepairTarget(creep);
					// if (!creep.memory.myRepairTarget) {
					// }
                }
			}
			else {
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
			break;
		default:
			console.log('agent: ' + creep.name + " the worker did not have an action.");
			creep.memory.myTask = 'resupply';
			actResupply.run(creep);
			break;
		}
    }
};

export default roleWorker;

function findBuildTarget(creep)
{
	var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
	creep.memory.myBuildTarget = target && target.id;
}

// not used currently
function findRepairTarget(creep)
{
	var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
		filter: (s) =>
			(s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART) && s.hits < s.hitsMax
	});

	creep.memory.myRepairTarget = target && target.id;
}
