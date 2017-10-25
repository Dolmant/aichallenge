var actHarvest = require('action.harvest');

var actResupply = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //find the closest containr or storage that has enough energy to fill me
        //it's been a while since I looked into this, jeeze this eats up a lot of CPU, this should check once then head towards it
        //TODO: make this not suck CPU, save the target etc.
        if (!creep.memory.resupplyTarget) {
            getResupplyTarget(creep);
        }
        if(creep.memory.resupplyTarget) {
            var resupplyTarget = Game.getObjectById(creep.memory.resupplyTarget);
            var err = resupplyTarget && creep.withdraw(resupplyTarget, RESOURCE_ENERGY)
            if (err == OK) {
                creep.memory.resupplyTarget = 0;
            } else if(err == ERR_NOT_IN_RANGE) {
                creep.moveTo(resupplyTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                getResupplyTarget(creep);
            }
        } else {
            actHarvest.run(creep);
        }
    }
};

function getResupplyTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy > 0 || (structure.storeCapacity && structure.store.energy > 0)));
        }
    });
    if (target) {
        creep.memory.resupplyTarget = target.id;
    }
}

module.exports = actResupply;