var actHarvest = {
    run: function(creep) {
        if (!creep.memory.sourceMap) {
            getSource(creep);
        }
        var source = Game.getObjectById(creep.memory.sourceMap);
        if (!source) {
            getSource(creep);
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var err = creep.moveTo(source);
            if (err == ERR_NO_PATH) {
                getSource(creep);
            }
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.sourceMap = nearestSource && nearestSource.id;
}

module.exports = actHarvest;