var util = require('util');

var roleMelee = {
    run(creep, mySpawns) {
        // move to and attack
        if (!Game.flags['Attack']) {
            console.log('Place Attack flag');
            return null;
        }
        var attackFlag = Game.flags['Attack'];
        // implement this
        if (Memory.attackers.attacking) {//&& !attackFlag.room.controller.safeMode) {
            if (creep.room.name == attackFlag.pos.roomName) {
                if (!creep.memory.attackCreep) {
                    findTarget(creep);
                }
                if (creep.memory.attackCreep) {
                    var target = Game.getObjectById(creep.memory.attackCreep);
                    if (target) {
                        var err = creep.attack(target);
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
                    creep.memory.renewing = true;
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

function findTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS,{
        filter: creep => creep.body.filter(part => (part.type == ATTACK) || (part.type == RANGED_ATTACK))
    });
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,{
            filter: structure => structure.structureType == STRUCTURE_TOWER,
        });
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    }
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    }
    if (target) {
        creep.memory.attackCreep = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

module.exports = roleMelee;