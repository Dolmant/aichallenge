var actHarvest = {
    run: function(creep) {
        if (!creep.memory.sourceSelect) {
            var nearestSource = creep.pos.findClosestByRange(FIND_SOURCES);
            creep.memory.sourceSelect = nearestSource.id;
        }
        var source = Game.getObjectById(creep.memory.sourceSelect);
        if(source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};

module.exports = actHarvest;