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
                creep.memory.attackCreep = hostiles[0].id;
            } else {
                if (Game.flags[mySquad]) {
                    creep.memory.moveToTargetx = Game.flags[mySquad].pos.x;
                    creep.memory.moveToTargety = Game.flags[mySquad].pos.y;
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

        const mySquad = creep.memory.squad;
        let allSpawned = 0;
        Memory.squads[mySquad].creeps.forEach(squadCreep => {
            if (Game.creeps[squadCreep] && !Game.creeps[squadCreep].spawning) {
                allSpawned += 1;
            }
        })
        if (Memory.squads[mySquad].size > allSpawned) {
            creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            creep.memory.moveToTargetrange = 0;
            creep.memory.myTask = 'moveToTarget';
        } else if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            if (!(creep.memory.secondaryRole == 'heal')) {
                if (!creep.memory.attackCreep) {
                    actOffensive.findDefenceTarget(creep);
                }
                if (!creep.memory.attackCreep) {
                    const NPCSpawns = creep.room.find(FIND_HOSTILE_STRUCTURES);
                    let cooldown = 999;
                    let target;
                    NPCSpawns.forEach(spawner => {
                        if (spawner.ticksToSpawn < cooldown) {
                            cooldown = spawner.ticksToSpawn;
                            target = spawner;
                        }
                    })
                    if (target) {
                        creep.memory.moveToTargetx = target.pos.x;
                        creep.memory.moveToTargety = target.pos.y;
                        creep.memory.moveToTargetrange = 0;
                        creep.memory.myTask = 'moveToTarget';
                    }
                } else {
                    creep.memory.myTask = 'dualAttack';
                }
            } else {
                if (!creep.healCreep) {
                    let healCreep;
                    Memory.squads[mySquad].creeps.forEach(squadCreep => {
                        if (squadCreep != creep.name) {
                            healCreep = Game.creeps[squadCreep].id;
                        }
                    });
                    creep.memory.healCreep = healCreep;
                }
                creep.memory.myTask = 'heal';
            }
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
        }
    },
    retired(creep: Creep) {
        /*
        goto staging
        */
        const mySquad = creep.memory.squad;
        if (creep.room.name == Memory.squads[mySquad].stagingTarget.roomName) {
            creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            creep.memory.moveToTargetrange = 0;
            creep.memory.myTask = 'moveToTarget';
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
                if (!creep.memory.attackCreep) {
                    let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                    let hostile_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                    let target;
                    if (!hostiles && hostile_structures) {
                        target = hostile_structures;
                    } else if (!hostile_structures && hostiles) {
                        target = hostiles;
                    } else {
                        target = creep.pos.findClosestByPath([hostiles, hostile_structures]);
                    }
                    creep.memory.attackCreep = target.id;
                }
                creep.memory.myTask = 'attack';
            }
        } else {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep)
                creep.memory.myTask = '';
            } else {
                creep.memory.myTask = 'goToTarget';
                creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
            }
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

        const mySquad = creep.memory.squad;
        if (Memory.squads[mySquad]) {
            if (Memory.squads[mySquad].size > Memory.squads[mySquad].creeps.length) {
                creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
                creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
                creep.memory.moveToTargetrange = 0;
                creep.memory.myTask = 'moveToTarget';
            } else if (creep.room.name == Memory.squads[mySquad].roomTarget) {
                if (!creep.memory.attackCreep) {
                    actOffensive.findDefenceTarget(creep);
                }
                creep.memory.myTask = 'attack';
            } else {
                creep.memory.myTask = 'goToTarget';
                creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
            }
        } else {
            console.log('EXTREME ERROR, DEFCON CREEP HAS WRONG SQUAD')
        }
    },
};

export default roleOffensive;
