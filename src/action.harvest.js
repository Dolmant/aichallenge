// @flow
const actHarvest = {
    run: function(creep) {
        if (!creep.memory.sourceMap && !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
        if (!source) {
            getSource(creep);
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.memory.myTask = "moveTo";
            var container = source.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container.length > 0) {
                creep.memory.moveToTargetx = container.pos.x;
                creep.memory.moveToTargety = container.pos.y;
            } else {
                creep.memory.moveToTargetx = source.pos.x;
                creep.memory.moveToTargety = source.pos.y;
            }
        }
    },
    runMinerals: function(creep) {
        if (!creep.memory.sourceMap) {
            var nearestSource = creep.pos.findClosestByPath(FIND_MINERALS);
            creep.memory.sourceMap = nearestSource && nearestSource.id;
        }
        var source = Game.getObjectById(creep.memory.sourceMap);
        if (!source) {
            return;
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var err = creep.moveTo(source, {'maxRooms': 1});
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.tempSourceMap = nearestSource && nearestSource.id;
}

export default actHarvest;