const actDeposit = {
    run: function(creep) {
        //if I'm carrying something that is not energy
        var currentEnergy = creep.carry.energy;
        if (_.sum(creep.carry) != currentEnergy) {
            depositResource(creep);
        }
        else if (!creep.memory.depositTarget) {
            deposit_target(creep);
        }
        var target = Game.getObjectById(creep.memory.depositTarget);
        if (target) {
            var err = creep.transfer(target, RESOURCE_ENERGY)
            if (err == ERR_NOT_IN_RANGE) {
                // Return early to prevent deletion of the deposit target
                return creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            } else if (err == OK) {
                // Adjust the promise on this object now it has been delivered
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
            } else {
                deposit_target(creep);
            }
        }
        // important to remove the depositTarget so a new one can be fetched
        delete creep.memory.depositTarget;
    }
};
function deposit_target(creep, isMule = false) {
    // Mule is the only one which will refuse to drop to a container
    if ((creep.room.memory.hasContainer || creep.room.memory.hasLinks) && creep.room.memory.hasMules && !isMule) {
        // We can use local links and containers and rely on mules for transport
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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

    if (creep.room.memory.energyRation > 0) {
        // We must deposit to the nearest none full spawn or extension
        // We do declare that this energy will be given. Promise ticks down 1 energy per tick, if it reaches 0
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': (structure) => {
                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && !(creep.room.memory.structures[structure.id] && creep.room.memory.structures[structure.id].energyRationPromise) && structure.energy < structure.energyCapacity);
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
    // Otherwise, hand it to the container for other use.
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

    creep.memory.depositTarget = 0;
}

function deposit_resource(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE) ;
        }
    });
    //TODO: figure out what the command for deposit all is
    if (target != undefined) {
        creep.moveTo(target);
        for (const resourceType in creep.carry) {
            creep.transfer(target, resourceType);
        }  
    }
}

module.exports = actDeposit;