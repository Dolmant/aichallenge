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
		
		if(creep.memory.MyTask == 1 && creep.carry.energy == 0){
    		creep.memory.MyTask = 0;
    		creep.say('harvest ');
		}
		if(creep.memory.MyTask == 0 && creep.carry.energy == creep.carryCapacity)
		{
			creep.memory.MyTask = 1;
		}
		switch(creep.memory.MyTask){
		case 0:
			//hungry, go eat
            getEnergy(creep);
			break;
		case 1:
			//do I already have something to build? If not find something to fix and say fixit
			if(creep.memory.MyTarget == undefined)
			{
                findTarget(creep);
                if(creep.memory.MyTarget != undefined)
                {
                    var target = Game.getObjectById(creep.memory.MyTarget);
    				creep.say('build');
                }
                else
                {
                    roleUpgrader.run(creep);
                }
			}
			else
			{
				
			    var target = Game.getObjectById(creep.memory.MyTarget);
				if(creep.build(target) == ERR_NOT_IN_RANGE) {
				    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
				}
				//if theres nothing to build
				if(target==undefined){
				    creep.memory.MyTarget = undefined;
					//creep.say('bored');
					roleUpgrader.run(creep);
				}
			}
			//go build something
			break;
		default:
			console.log('agent: ' + creep.name + " the builder did not have an action.");
			creep.memory.MyTask = 0;
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
function findTarget(creep)
{
	
	var targets = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(targets != undefined)
    {
		creep.memory.MyTarget = targets.id;
    }

}


module.exports = roleBuilder;