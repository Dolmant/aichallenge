var actDeposit = {
    
        /** @param {Creep} creep **/
        run: function(creep) {
            // TODO allow a priority to be passed OR deposit some into the container?
            //if I'm carrying something that is not energy
            if (_.sum(creep.carry) != creep.carry.energy)
            {
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
            else
            {
                // TODO remove hardcoding of spawn
                if (Game.spawns['Spawn1'].energyCapacity > Game.spawns['Spawn1'].energy && creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn1']);
                }
                else {
                    // TODO prioritize this
                    //I'm only carrrying energy, lets find a place to deposit it
                    //find the closest extension or tower
                    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_TOWER ||
                                structure.structureType == STRUCTURE_STORAGE ||
                                structure.structureType == STRUCTURE_CONTAINER) && structure.energy < structure.energyCapacity);
                            }
                        });
                    //found an extension or tower, depositing
                    if (target!=undefined) {
                        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else {
                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_CONTROLLER);
                            }
                        });
                        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
        }
    };
    
    
    module.exports = actDeposit;