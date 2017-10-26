var util = require('util');

var roleHealer = {
    run(creep, mySpawns) {
        if (creep.hits == creep.hitsMax) {
            Memory.attackers.forceInAction.healer += 1;
        }
        if (Memory.attackers.attacking) {
            // move to and attack
            if (creep.room.name == Memory.attackers.attackRoom.name) {
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
                    creep.moveTo(new RoomPosition(Memory.attackers.attackRoom.x, Memory.attackers.attackRoom.y, Memory.attackers.attackRoom.name), {ignoreCreeps: true})
                }
            } else {
                creep.memory.goToTarget = Memory.attackers.attackRoom.name;
                util.goToTarget(creep);
            }
        } else {
            if (creep.room.name == Memory.attackers.marshallRoom.name) {
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
                    creep.moveTo(new RoomPosition(Memory.attackers.marshallRoom.x, Memory.attackers.marshallRoom.y, Memory.attackers.marshallRoom.name))
                }
            } else {
                creep.memory.goToTarget = Memory.attackers.marshallRoom.name;
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
