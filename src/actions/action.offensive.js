
// @flow
var actOffensive = {
    heal: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        if (target) {
            var err = creep.heal(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.healCreep;
                return true;
            }
        } else {
            delete creep.memory.healCreep;
            return true;
        }
    },
    attack: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    rangedAttack: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.rangedAttack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    block: function(creep: Creep) {
        var block1Flag = Game.flags['blocker1'];
        var block2Flag = Game.flags['blocker2'];
        var block3Flag = Game.flags['blocker3'];
        var err = 0;
        if (!creep.memory.blockTarget && !creep.memory.done) {
            if (block1Flag) {
                err = creep.moveTo(block1Flag.pos);
                if (err == ERR_NO_PATH) {
                    if (block2Flag) {
                        var err = creep.moveTo(block2Flag.pos);
                        if (err == ERR_NO_PATH) {
                            if (block3Flag) {
                                var err = creep.moveTo(block3Flag.pos);
                                if (err == ERR_NO_PATH) {
                                    return
                                } else {
                                    creep.memory.blockTarget = block3Flag.id;
                                }
                            }
                        } else {
                            creep.memory.blockTarget = block2Flag.id;
                        }
                    }
                } else {
                    creep.memory.blockTarget = block1Flag.id;
                }
            }
        }
        if (creep.memory.blockTarget && !creep.memory.done) {
            var blockTarget = Game.getObjectById(creep.memory.blockTarget);
            if (creep.pos.getRangeTo(blockTarget.pos) <= 1) {
                creep.memory.done = true;
            } else {
                err = creep.moveTo(blockTarget.pos);
                if (err = ERR_NO_PATH) {
                    delete creep.memory.blockTarget;
                }
            }
        }
    },
    gather: function(creep: Creep) {
        if (Memory.attackers.attacking) {
            creep.moveTo(Game.flags['Attack'].pos);
            return true;
        } else {
            creep.moveTo(Game.flags['Marshal'].pos);
        }
    },
    renew: function(creep: Creep, mySpawns: Array<StructureSpawn>) {
        var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
        if (!mySpawns[0].memory.renewTarget && inRange) {
            mySpawns[0].memory.renewTarget = creep.id
        } else if (!inRange) {
            creep.moveTo(mySpawns[0].pos);
        }
    },
    findTarget: function(creep: Creep) {
        if (creep.memory.role == 'healer') {
            findHealingTarget(creep);
        } else if (creep.memory.role == 'blocker') {
            creep.memory.myTask = 'block';
        } else {
            findAttackTarget(creep);
        }
    }
};
function findHealingTarget(creep: Creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        'filter': creep => creep.hits < creep.hitsMax,
    });
    if (target) {
        creep.memory.healCreep = target.id;
    } else {
        delete creep.memory.healCreep;
    }
}
function findAttackTarget(creep: Creep) {
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
        filter: creep => creep.body.filter(part => (part.type == ATTACK) || (part.type == RANGED_ATTACK))
    });
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,{
            filter: structure => structure.structureType == STRUCTURE_TOWER,
        });
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_SPAWN,
        });
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_STORAGE,
        });
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => structure.structureType == STRUCTURE_WALL
        });
    }
    if (target) {
        creep.memory.attackCreep = target.id;
        creep.memory.myTask = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

export default actOffensive;
