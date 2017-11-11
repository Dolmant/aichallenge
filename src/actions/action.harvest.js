// @flow
const actHarvest = {
    run: function(creep: Creep) {
        if (!creep.memory.sourceMap && !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        if (creep.carry.energy == creep.carryCapacity) {
            // expect state change to deposit
            return true;
        }
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
        if (!source) {
            getSource(creep);
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container.length > 0) {
                creep.memory.moveToTargetx = container[0].pos.x;
                creep.memory.moveToTargety = container[0].pos.y;
                creep.memory.moveToTargetrange = 0;
            } else {
                creep.memory.moveToTargetx = source.pos.x;
                creep.memory.moveToTargety = source.pos.y;
                creep.memory.moveToTargetrange = 1;
            }
            // expect state change to movetotarget
            return true;
        }
    },
    runMinerals: function(creep: Creep) {
        if (!creep.memory.sourceMap) {
            var nearestSource = creep.pos.findClosestByPath(FIND_MINERALS);
            creep.memory.sourceMap = nearestSource && nearestSource.id;
        }
        if (_.sum(creep.carry) == creep.carryCapacity) {
            // expect state change to deposit
            return true;
        }
        var source = Game.getObjectById(creep.memory.sourceMap);
        if (!source) {
            return;
        } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container.length > 0) {
                creep.memory.moveToTargetx = container[0].pos.x;
                creep.memory.moveToTargety = container[0].pos.y;
                creep.memory.moveToTargetrange = 0;
            } else {
                creep.memory.moveToTargetx = source.pos.x;
                creep.memory.moveToTargety = source.pos.y;
                creep.memory.moveToTargetrange = 1;
            }
            // expect state to change to movetotarget
            return true;
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.tempSourceMap = nearestSource && nearestSource.id;
}

export default actHarvest;