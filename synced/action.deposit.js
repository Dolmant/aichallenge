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
                if (!Memory.structures[target.id]) {Memory.structures[target.id] = {}};
                Memory.structures[target.id].energyRationPromise = 0;
                if (target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN) {
                    if ((structure.energyCapacity - structure.energy) > currentEnergy) {
                        creep.room.memory.energyRation -= transfer;
                    } else {
                        creep.room.memory.energyRation -= structure.energyCapacity - structure.energy;
                    }
                }
            }
        }
        // important to remove the depositTarget so a new one can be fetched
        delete creep.memory.depositTarget;
    }
};
function deposit_target(creep) {
    if (creep.room.memory.hasContainers && creep.room.memory.hasLinks && creep.room.memory.hasMules) {
        // We can use local links and containers and rely on mules for transport
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': (structure) => {
                return ((structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_LINK) && structure.energy < structure.energyCapacity);
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
                return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && !(Memory.structures[structure.id] && Memory.structures[structure.id].energyRationPromise) && structure.energy < structure.energyCapacity);
            },
        });
        if (target) {
            if (!Memory.structures[target.id]) {Memory.structures[target.id] = {}};
            Memory.structures[target.id].energyRationPromise += creep.carry.energy;
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
        if (!Memory.structures[target.id]) {Memory.structures[target.id] = {}};
        Memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }
    // Otherwise, hand it to the container for other use.
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity);
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
        if (!Memory.structures[target.id]) {Memory.structures[target.id] = {}};
        Memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }
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