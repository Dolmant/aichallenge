
// @flow
var actOffensive = {
    heal: function(creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        if (target) {
            var err = creep.heal(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.healCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.healCreep;
        }
    },
    attack: function(creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        if (target) {
            var err = creep.attack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.attackCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.attackCreep;
        }
    },
    rangedAttack: function(creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        if (target) {
            var err = creep.rangedAttack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.attackCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.attackCreep;
        }
    },
    gather: function(creep) {
        if (Memory.attackers.attacking) {
            creep.moveTo(Game.flags['Attack'].pos, {ignoreCreeps: true});
        } else {
            creep.moveTo(Game.flags['Marshal'].pos, {ignoreCreeps: true});
        }
    },
    renew: function(creep, mySpawns) {
        var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
        if (!mySpawns[0].memory.renewTarget && inRange) {
            mySpawns[0].memory.renewTarget = creep.id
        } else if (!inRange) {
            creep.moveTo(mySpawns[0].pos);
        }
    },
    findTarget: function(creep) {
        if (creep.memory.role == 'healer') {
            findHealingTarget(creep);
        } else {
            findAttackTarget(creep);
        }
    }
};
function findHealingTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        'filter': creep => creep.hits < creep.hitsMax,
    });
    if (target) {
        creep.memory.healCreep = target.id;
    } else {
        delete creep.memory.healCreep;
    }
}
function findAttackTarget(creep) {
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
            filter: structure => structure.structureType != STRUCTURE_CONTROLLER,
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
