var actHarvest = require('action.harvest');

var actResupply = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //find the closest containr or storage that has enough energy to fill me
        //it's been a while since I looked into this, jeeze this eats up a lot of CPU, this should check once then head towards it
        //TODO: make this not suck CPU, save the target etc.
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && (structure.store.energy > creep.carryCapacity-creep.carry.energy);
                }
        });
        if(target!= undefined) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        //I couldn't find enough energy, lets go harvest it from a resource node.
        else
        {
			actHarvest.run(creep);
        }
    }
};

module.exports = actResupply;