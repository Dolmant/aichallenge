// @flow
import util from './../util';
import actOffensive from './../actions/action.offensive';

const roleOffensive = {
    run(creep: Creep, mySpawns: Array<StructureSpawn>) {
        if (Memory.attackers.attacking) {//&& !attackFlag.room.controller.safeMode) {
            // move to and attack
            if (!Game.flags['Attack']) {
                console.log('Place Attack flag');
                return null;
            }
            var attackFlag = Game.flags['Attack'];
            if (creep.room.name == attackFlag.pos.roomName) {
                if(creep.memory.myTask != 'heal' && creep.memory.myTask != 'attack' && creep.memory.myTask != 'block') {
                    actOffensive.findTarget(creep);
                    if (creep.memory.healCreep) {
                        creep.memory.myTask = 'heal';
                    } else if (creep.memory.attackCreep) {
                        switch(creep.memory.role) {
                            case 'ranged':
                                creep.memory.myTask = 'rangedAttack';
                                break;
                            case 'melee':
                                creep.memory.myTask = 'attack';
                                break;
                            default:
                                creep.memory.myTask = 'attack';
                                break;
                        }
                    } else if (creep.memory.myTask == 'block') {
                        return;
                    } else {
                        creep.memory.myTask = 'gather';
                    }
                }
            } else if (creep.memory.myTask != 'goToTarget') {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                creep.memory.myTask = 'goToTarget';
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
                if (creep.memory.myTask == 'renew' && creep.ticksToLive > 1400) {
                    creep.memory.myTask = 'gather';
                }
                if (creep.ticksToLive < 1000 || creep.memory.myTask == 'renew') {
                    creep.memory.myTask = 'renew';
                } else {
                    creep.memory.myTask = 'gather';
                }
            } else if (creep.memory.myTask != 'goToTarget') {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                creep.memory.myTask = 'goToTarget';
            }
        }
    },
};

export default roleOffensive;
