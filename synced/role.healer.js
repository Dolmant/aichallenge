var util = require('util');

var roleHealer = {
    run(creep, mySpawns) {
        if (creep.hits == creep.hitsMax) {
            Memory.attackers.forceInAction.healer += 1;
        }
        if (Memory.attackers.attacking) {
            // move to and attack
            if (!Memory.Game.flags['Attack']) {
                console.log('Place Attack flag');
                return null;
            }
            var attackFlag = Memory.Game.flags['Attack'];
            if (creep.room.name == attackFlag.room.name) {
                if (!creep.memory.healCreep) {
                    findTarget(creep);
                }
                if (creep.memory.healCreep) {
                    var target = Game.getObjectById(creep.memory.healCreep);
                    if (target) {
                        var err = creep.heal(target);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.pos);
                        } else if (err == ERR_INVALID_TARGET) {
                            findTarget(creep);
                        }
                    } else {
                        findTarget(creep);
                    }
                } else {
                    creep.moveTo(new RoomPosition(attackFlag.pos.x, attackFlag.pos.y, attackFlag.room.name), {ignoreCreeps: true})
                }
            } else {
                creep.memory.goToTarget = attackFlag.room.name;
                util.goToTarget(creep);
            }
        } else {
            if (!Memory.Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Memory.Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.room.name) {
                if (creep.memory.renewing && creep.ticksToLive > 1400) {
                    delete creep.memory.renewing;
                }
                if (creep.ticksToLive < 1000 || creep.memory.renewing) {
                    var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
                    if (!mySpawns[0].memory.renewTarget && inRange) {
                        mySpawns[0].memory.renewTarget = creep.id
                    } else if (!inRange) {
                        creep.moveTo(mySpawns[0].pos);
                    }
                } else {
                    creep.moveTo(new RoomPosition(marshalFlag.pos.x, marshalFlag.pos.y, marshalFlag.room.name))
                }
            } else {
                creep.memory.goToTarget = marshalFlag.room.name;
                util.goToTarget(creep);
            }
        }
    },
};

function findTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        'filter': creep => creep.hits < creep.hitsMax,
    });
    if (target) {
        creep.memory.healCreep = target.id;
    } else {
        delete creep.memory.healCreep;
    }
}

module.exports = roleHealer;
