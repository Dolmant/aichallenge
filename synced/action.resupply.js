var actHarvest = require('action.harvest');

var actResupply = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //find the closest containr or storage that has enough energy to fill me
        //it's been a while since I looked into this, jeeze this eats up a lot of CPU, this should check once then head towards it
        //TODO: make this not suck CPU, save the target etc.
        if (!creep.memory.resupplyTarget) {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity || (structure.storeCapacity && structure.store.energy < structure.storeCapacity)));
                }
            });
            if (target) {
                creep.memory.resupplyTarget = target.id;
            }
        }
        if(creep.memory.resupplyTarget) {
            var resupplyTarget = Game.getObjectById(creep.memory.resupplyTarget);
            if(resupplyTarget && creep.withdraw(resupplyTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resupplyTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            actHarvest.run(creep);
        }
    }
};

module.exports = actResupply;