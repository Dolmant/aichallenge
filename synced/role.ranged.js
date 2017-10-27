var util = require('util');

var roleRanged = {
    run(creep, mySpawns) {
        if (creep.hits == creep.hitsMax) {
            Memory.misc.globalCreepsTemp.ranged += 1;
        }
        if (Memory.attackers.attacking) {
            // move to and attack
            if (!Game.flags['Attack']) {
                console.log('Place Attack flag');
                return null;
            }
            var attackFlag = Game.flags['Attack'];
            if (creep.room.name == attackFlag.name) {
                if (!creep.memory.attackCreep) {
                    findTarget(creep);
                }
                if (creep.memory.attackCreep) {
                    var target = Game.getObjectById(creep.memory.attackCreep);
                    if (target) {
                        var err = creep.rangedAttack(target);
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
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
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
                    creep.memory.renewing = true;
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
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    }
    if (target) {
        creep.memory.attackCreep = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

module.exports = roleRanged;