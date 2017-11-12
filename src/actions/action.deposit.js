// @flow
const actDeposit = {
    run: function(creep: Creep, isMule: boolean) {
        //if I'm carrying something that is not energy
        var currentEnergy = creep.carry.energy;
        if (_.sum(creep.carry) != currentEnergy) {
            deposit_resource(creep, isMule);
        }
        else if (!creep.memory.depositTarget) {
            deposit_target(creep, isMule);
        }
        if (_.sum(creep.carry) == 0) {
            delete creep.memory.depositTarget;
            return true;
        }
        var target = Game.getObjectById(creep.memory.depositTarget);
        if (target) {
            var err = creep.transfer(target, RESOURCE_ENERGY)
            if (err == ERR_INVALID_ARGS) {
                var err = creep.transfer(target, RESOURCE_ENERGY, (target.energyCapacity - target.energy) || (target.storeCapacity && (target.storeCapacity - target.store.energy)))
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {'maxRooms': 1});
                // Return early to prevent deletion of the deposit target
                return false;
            } else if (err == OK) {
                // Adjust the promise on this object now it has been delivered
                delete creep.memory.depositTarget;
                if (!creep.room.memory.structures[target.id]) {creep.room.memory.structures[target.id] = {}};
                creep.room.memory.structures[target.id].energyRationPromise = 0;
                if (target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN) {
                    //TODO disabled these two because ration updates arent working
                    if ((target.energyCapacity - target.energy) > currentEnergy) {
                        creep.room.memory.energyRation -= currentEnergy;
                    } else {
                        creep.room.memory.energyRation -= target.energyCapacity - target.energy;
                    }
                }
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                //expect a return to harvesting or muling here
                delete creep.memory.depositTarget;
                return true;
            } else {
                deposit_target(creep, isMule);
            }
        }
        // important to remove the depositTarget so a new one can be fetched
        delete creep.memory.depositTarget;
    },
    lazydeposit: function(creep: Creep) {
        if (creep.memory.lazyContainer) {
            const lazyContainer = Game.getObjectById(creep.memory.lazyContainer);
            if (creep.carry.energy == 0) {
                return true
            }
            if (lazyContainer) {
                var err;
                if (lazyContainer.hits < lazyContainer.hitsMax / 2) {
                    err = creep.repair(lazyContainer);
                    if (err == ERR_NOT_ENOUGH_RESOURCES) {
                        return true
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lazyContainer.pos, {'maxRooms': 1});
                    } else {
                        return true;
                    }
                } else {
                    err = creep.transfer(lazyContainer, RESOURCE_ENERGY);
                    if (err == ERR_FULL || err == ERR_INVALID_ARGS || err == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.drop(RESOURCE_ENERGY);
                        return true
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lazyContainer.pos, {'maxRooms': 1});
                    } else {
                        return true;
                    }
                }
            } else {
                delete creep.memory.lazyContainer;
            }
        } else {
            var const_site = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (const_site.length > 0) {
                creep.memory.myBuildTarget = const_site[0].id;
                // expect state change to build
                return true;
            } else {
                var container_site = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER
                });
                if (container_site.length > 0) {
                    creep.memory.lazyContainer = container_site[0].id
                } else {
                    // Could create it on the creep for guanranteed space, but I am pretty sure you cant build on what you are standing on
                    creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
                }
            }
        }
    }
};

function deposit_target(creep, isMule) {
    // Mule is the only one which will refuse to drop to a container
    var economy = creep.room.memory.myCreepCount.muleCount && (creep.room.memory.myCreepCount.harvesterCount > 0)
    if ((creep.room.memory.hasContainers) && economy && !isMule) {
        // We can use local links and containers and rely on mules for transport
        var target = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            'filter': (structure) => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return ((structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity || (structure.storeCapacity && structure.store.energy < structure.storeCapacity)));
            },
            'algorithm': 'dijkstra',
        });
        target = target.length > 0 ? target : creep.pos.findInRange(FIND_STRUCTURES, 1, {
            'filter': (structure) => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && (structure.energy < structure.energyCapacity || (structure.storeCapacity && structure.store.energy < structure.storeCapacity)));
            },
            'algorithm': 'dijkstra',
        });
        target = target.length > 0 ? target[0] : creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': (structure) => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity || (structure.storeCapacity && structure.store.energy < structure.storeCapacity)));
            },
            'algorithm': 'dijkstra',
        });
        if (target) {
            creep.memory.depositTarget = target.id;
            return true;
        }
    }

    if (true) {//(creep.room.memory.energyRation > 0) {
        // We must deposit to the nearest none full spawn or extension
        // We do declare that this energy will be given. Promise ticks down 1 energy per tick, if it reaches 0
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': (structure) => {
                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity); //&& !(creep.room.memory.structures[structure.id] && (creep.room.memory.structures[structure.id].energyRationPromise >= (structure.energyCapacity - structure.energy))) 
            },
        });
        if (target) {
            if (!creep.room.memory.structures[target.id]) {creep.room.memory.structures[target.id] = {}};
            creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
            creep.memory.depositTarget = target.id;
            return true;
        }
    }
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': (structure) => {
            return ((structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity);
        },
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {creep.room.memory.structures[target.id] = {}};
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }
    // Otherwise, hand it to the storage for other use.
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': (structure) => {
            return ((structure.structureType == STRUCTURE_STORAGE) && structure.store.energy < structure.storeCapacity);
        },
    });
    if (target) {
        creep.memory.depositTarget = target.id;
        return true;
    }


    // Failsafe, give it to spawn or extension
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity);
        },
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {creep.room.memory.structures[target.id] = {}};
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }

    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store.energy < structure.storeCapacity);
        },
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {creep.room.memory.structures[target.id] = {}};
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }

    creep.memory.depositTarget = 0;
}

function deposit_resource(creep, isMule) {
    var target;
    if (isMule) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE) && _.sum(structure.store) < structure.storeCapacity;
            }
        });
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity;
            }
        });
    }
    //TODO: figure out what the command for deposit all is
    var err;
    if (target != undefined) {
        for (const resourceType in creep.carry) {
            err = creep.transfer(target, resourceType);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {'maxRooms': 1});
            }
        }  
    }
}

export default actDeposit;
