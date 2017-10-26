var actHarvest = {
    run: function(creep) {
        if (!creep.memory.sourceMap || !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
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
    creep.memory.tempSourceMap = nearestSource && nearestSource.id;
}

module.exports = actHarvest;