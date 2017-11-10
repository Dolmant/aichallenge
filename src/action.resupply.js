// @flow
import actHarvest from './action.harvest';

const actResupply = {
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
            if (err == OK || err == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.resupplyTarget = 0;
            } else if(err == ERR_NOT_IN_RANGE) {
                creep.moveTo(resupplyTarget, {'visualizePathStyle': {stroke: '#ffffff'}, 'maxRooms': 1});
            } else {
                getResupplyTarget(creep);
            }
        } else {
            actHarvest.run(creep);
        }
    },
    getEnergy: function(creep) {
        if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
            getTargets(creep);
        }
        var target = 0;
        if (creep.memory.dropTarget) {
            target = Game.getObjectById(creep.memory.dropTarget);
            var err = target && creep.pickup(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {'maxRooms': 1});
            } else if (err == OK) {
                creep.memory.dropTarget = 0
            } else {
                getTargets(creep);
            }
        } else if (creep.memory.fetchTarget) {
            target = Game.getObjectById(creep.memory.fetchTarget);
            var err = target && creep.withdraw(target, RESOURCE_ENERGY);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {'maxRooms': 1});
            } else if (err == OK) {
                creep.memory.fetchTarget = 0
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                var resources = Object.keys(target.store);
                // first one is usually energy due to alphbetical order TODO fix this to be error free
                err = creep.withdraw(target, resources[1]);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {'maxRooms': 1});
                } else if (err == OK) {
                    creep.memory.fetchTarget = 0
                } else {
                    getTargets(creep);
                }
            } else {
                getTargets(creep);
            }
        }
    }
};

function getTargets(creep) {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
        creep.memory.dropTarget = target.id;
        creep.memory.fetchTarget = 0;
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) > creep.carryCapacity;
            }
        });
        if (target) {
            creep.memory.fetchTarget = target.id;
            creep.memory.dropTarget = 0;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) > creep.carryCapacity;
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
                creep.memory.dropTarget = 0;
            }
        }
    }
}

function getResupplyTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy > creep.carryCapacity || (structure.storeCapacity && structure.store.energy > creep.carryCapacity)));
        }
    });
    if (target) {
        creep.memory.resupplyTarget = target.id;
    }
}

export default actResupply;
