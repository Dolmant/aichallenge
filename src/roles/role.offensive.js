// @flow
import util from './../util';
import actOffensive from './../actions/action.offensive';

const roleOffensive = {
    guard(creep: Creep) {
        /*
        if not in target room
            goto target room
        else 
            if hostile within 5
                attack hostile
            else
                head to roomnameguard flag
        */
        const mySquad = creep.memory.squad;
        if (creep.ticksToLive < 300 || creep.memory.myTask == 'renew') {
            creep.memory.myTask = 'renew';
        } else if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
            if (hostiles.length > 0 ) {
                creep.memory.myTask = 'attack';
                creep.memory.attackTarget = hostiles[0].id;
            } else {
                if (Game.flags[mySquad]) {
                    creep.memory.moveToTargetx = Game.flags[mySquad + creep.room.name].pos.x;
                    creep.memory.moveToTargety = Game.flags[mySquad + creep.room.name].pos.y;
                    creep.memory.moveToTargetrange = 0;
                } else {
                    creep.memory.moveToTargetx = 25;
                    creep.memory.moveToTargety = 25;
                    creep.memory.moveToTargetrange = 0;
                }
                creep.memory.myTask = 'moveToTarget';
            }
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
        }
    },
    farm(creep: Creep) {
        /*
        if staging
            head to staging point
        else 
            if not in target
                goto target
            else 
                if hostiles and attacker
                    attack nearest hostile
                else
                    head to spawer with lowest timer
                    if healer, heal me or buddy
                
        */
    },
    retired(creep: Creep) {
        /*
        goto staging
        */
        if (creep.room.name == Memory.squads[mySquad].stagingTarget) {
            creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            creep.memory.moveToTargetrange = 0;
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].stagingTarget.roomName;
        }
    },
    grinder(creep: Creep) {
        /*
        if not in target 
            if health max
                goto target
            else heal self
        else 
            if health less than 90 and 5 < y < 45  and 5 < x < 45
                goto staging
            else
                heal self
                attack closest
        */
        const mySquad = creep.memory.squad;
        if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            if (creep.hits < creep.hitsMax * 0.7 || (creep.hits < creep.hitsMax * 0.9 && 5 < creep.pos.x && creep.pos.x < 45 && 5 < creep.pos.y && creep.pos.y < 45)) {
                creep.memory.myTask = 'goToTarget';
                creep.memory.goToTarget = Memory.squads[mySquad].stagingTarget.roomName;
            } else {
                let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                let hostile_structures = creep.pos.findClosestByPath(FIND_STRUCTURES);
                let target;
                if (!hostiles && hostile_structures) {
                    target = hostile_structures;
                } else if (!hostile_structures && hostiles) {
                    target = hostiles;
                } else {
                    target = creep.pos.findClosestByPath([hostiles, hostile_structures]);
                }
                creep.memory.myTask = 'attack';
                creep.memory.attackTarget = target.id;
            }
        } else if (creep.room.name == Memory.squads[mySquad].stagingTarget.roomName) {
            if (Game.flags[mySquad + creep.room.name]) {
                creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
                creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
                creep.memory.moveToTargetrange = 0;
            }
            creep.memory.myTask = 'moveToTarget';
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].stagingTarget.roomName;
        }
    },
    defcon(creep: Creep) {
        /*
        if not all creeps
            goto staging
        else
            if not in target
                goto target
            else 
                attack any hostiles in the room
        */
    },
};

export default roleOffensive;
