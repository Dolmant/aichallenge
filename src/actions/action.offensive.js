
// @flow
var actOffensive = {
    heal: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        let alternativeTarget = false;
        if (target) {
            if (creep.hits < creep.hitsMax * 0.9) {
                creep.heal(creep);
            } else {
                const array = creep.pos.findInRange(FIND_MY_CREEPS, 3)
                array.forEach((luckyCreep) => {
                    if(!alternativeTarget && luckyCreep.id != target.id && luckyCreep.id != creep.id && luckyCreep.hits < luckyCreep.hitsMax) {
                        creep.rangedHeal(luckyCreep);
                        alternativeTarget = true;
                    }
                });
            }
            if (!alternativeTarget) {
                if (target.hits < target.hitsMax) {
                    var err = creep.heal(target);
                    if (err == ERR_INVALID_TARGET) {
                        delete creep.memory.healCreep;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.rangedHeal(target);
                    }
                }
                creep.moveToCacheTarget(target.pos, {'maxRooms': 1});
            }
        } else {
            delete creep.memory.healCreep;
            return true;
        }
    },
    dualAttack: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            // removing as enemies on that spot will otherwise be left alone
            // if (target.pos.x != 0 && target.pos.y != 49 && target.pos.x != 49 && target.pos.y != 0) {
            creep.moveToCacheTarget(target.pos, {'maxRooms': 1});
            // }
            if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.rangedAttack(target)
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    attack: function(creep: Creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            creep.moveToCacheTarget(target.pos, {'maxRooms': 1});
            if (err == ERR_INVALID_TARGET) {
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
                creep.moveToCacheTarget(target.pos, {'maxRooms': 1});
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
                err = creep.moveToCacheTarget(block1Flag.pos, {'maxRooms': 1});
                if (err == ERR_NO_PATH) {
                    if (block2Flag) {
                        var err = creep.moveToCacheTarget(block2Flag.pos, {'maxRooms': 1});
                        if (err == ERR_NO_PATH) {
                            if (block3Flag) {
                                var err = creep.moveToCacheTarget(block3Flag.pos, {'maxRooms': 1});
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
                err = creep.moveToCacheTarget(blockTarget.pos, {'maxRooms': 1});
                if (err = ERR_NO_PATH) {
                    delete creep.memory.blockTarget;
                }
            }
        }
    },
    gather: function(creep: Creep) {
        if (Memory.attackers.attacking) {
            creep.moveToCacheTarget(Game.flags['Attack'].pos, {'maxRooms': 1});
            return true;
        } else {
            if (creep.pos.getRangeTo(Game.flags['Marshal'].pos) <= 2) {
                return true;
            } else {
                creep.moveToCacheTarget(Game.flags['Marshal'].pos, {'maxRooms': 1});
            }
        }
    },
    renew: function(creep: Creep, mySpawns: Array<StructureSpawn>) {
        if (mySpawns[0]) {
            var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
            if (creep.ticksToLive > 1400 || Memory.attackers.attacking) {
                return true;
            }
            if (!mySpawns[0].memory.renewTarget && inRange) {
                mySpawns[0].memory.renewTarget = creep.id
            } else if (!inRange) {
                creep.moveToCacheTarget(mySpawns[0].pos, {'maxRooms': 1});
            }
        }
    },
    findTarget: function(creep: Creep) {
        if (creep.memory.role == 'healer') {
            actOffensive.findHealingTarget(creep);
        } else if (creep.memory.role == 'blocker') {
            creep.memory.myTask = 'block';
        } else {
            actOffensive.findAttackTarget(creep);
        }
    },
    findHealingTarget: function(creep: Creep) {
        var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            'filter': creep => creep.hits < creep.hitsMax,
        });
        if (target) {
            creep.memory.healCreep = target.id;
        } else {
            delete creep.memory.healCreep;
        }
    },
    findDefenceTarget: function(creep: Creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
            filter: creep => creep.body.filter(part => (part.type == ATTACK) || (part.type == RANGED_ATTACK))
        });
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        }
        if (target) {
            creep.memory.attackCreep = target.id;
        } else {
            delete creep.memory.attackCreep;
        }
    },
    findAttackTarget: function(creep: Creep) {
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
        } else {
            delete creep.memory.attackCreep;
        }
    },
};

export default actOffensive;
