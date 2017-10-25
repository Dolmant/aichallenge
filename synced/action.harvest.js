var actHarvest = {
    run: function(creep) {
        if (!creep.memory.sourceMap) {
            getSource(creep);
        }
        var source = Game.getObjectById(creep.memory.sourceMap);
        if (!source) {
            getSource(creep);
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByRange(FIND_SOURCES);
    creep.memory.sourceMap = nearestSource && nearestSource.id;
}

module.exports = actHarvest;