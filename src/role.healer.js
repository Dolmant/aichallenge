// @flow
import util from './util';

const roleHealer = {
    run(creep, mySpawns) {
        // move to and attack
        if (!Game.flags['Attack']) {
            console.log('Place Attack flag');
            return null;
        }
        var attackFlag = Game.flags['Attack'];
        if (Memory.attackers.attacking) {//&& !attackFlag.room.controller.safeMode) {
            if (creep.room.name == attackFlag.pos.roomName) {
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
                    creep.moveTo(attackFlag.pos, {ignoreCreeps: true});
                }
            } else {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                util.goToTarget(creep);
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
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
                    creep.moveTo(marshalFlag.pos);
                }
            } else {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                util.goToTarget(creep);
            }
        }
    },
};

export default roleHealer;

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