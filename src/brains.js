import roleOffensive from './roles/role.offensive'
import actBuild from './actions/action.build'
import actClaim from './actions/action.claim'
import actOffensive from './actions/action.offensive'
import util from './util'

const brains = {
    run() {
        /*
        For each creep in each squad
        run offensive actions plus the 'task' role for the squad
        */
        for (let squadName in Memory.squads) {
            let creepArray = Memory.squads[squadName].creeps;

            if (Memory.squads[squadName].size == 0) {
                if (creepArray.length == 0) {
                    const indexer = Memory.retiredSquads.indexOf(squadName);
                    if (indexer != -1) {
                        Memory.retiredSquads.splice(indexer, indexer + 1);
                    }
                    delete Memory.squads[squadName];
                    continue;
                }
                if (Memory.squads[squadName].role != 'retired') {
                    brains.retireSquad(squadName);
                }
            }

            // Always run role to make sure we can control if we need to attack or not
            creepArray && creepArray.forEach((creepID, index) => {
                if (Memory.squads[squadName]) {
                    const creep = Game.creeps[creepID];
                    if (creep) {
                        switch(Memory.squads[squadName].role){
                            case 'retired':
                                roleOffensive.retired(creep);
                                break;
                            case 'farm':
                                roleOffensive.farm(creep);
                                break;
                            case 'defcon':
                                roleOffensive.defcon(creep);
                                break;
                            case 'guard':
                                roleOffensive.guard(creep);
                                break;
                            case 'grinder':
                                roleOffensive.grinder(creep);
                                break;
                        }
                        if ((creep.ticksToLive < 350 || creep.memory.forceRevive) && creep.memory.secondaryRole === 'heal' && Memory.squads[squadName].role === 'farm' && !creep.memory.revived) {
                            creepArray.forEach(squadCreepID => {
                                const squadCreep = Game.creeps[squadCreepID];
                                if (squadCreep) {
                                    squadCreep.memory.revived = true;
                                }
                            });
                            console.log('pushing new squad now');
                            Memory.squad_requests.push({
                                'squad': Memory.squads[squadName].roomTarget + 'farm' + Game.time,
                                'role':'farm',
                                'roomTarget': Memory.squads[squadName].roomTarget,
                                'size': 2,
                            });
                        }
                    } else {
                        if (Memory.squads[squadName].role === 'farm') {
                            let revived = false;
                            creepArray.forEach(squadCreepID => {
                                const squadCreep = Game.creeps[squadCreepID];
                                if (squadCreep && !squadCreep.memory.revived && !revived) {
                                    console.log('reviving squad before deleting');
                                    revived = true;
                                    Memory.squad_requests.push({
                                        'squad': Memory.squads[squadName].roomTarget + 'farm' + Game.time,
                                        'role':'farm',
                                        'roomTarget': Memory.squads[squadName].roomTarget,
                                        'size': 2,
                                    });
                                }
                            });
                            console.log('deleting: ' + squadName);
                            console.log('creep: ' + creepID)
                            delete Memory.squads[squadName];
                        } else {
                            Memory.squads[squadName].creeps.splice(index, index + 1);
                            if (Memory.squads[squadName].role != 'retired') {
                                const options = {
                                    'role': Memory.squads[squadName].role,
                                    'myTask': Memory.squads[squadName].role,
                                    'squad': squadName,
                                };
                                brains.buildRequest(Memory.squads[squadName].roomTarget, 1, options);
                            }
                        }
                    }
                }
            });
        }
    },
    buildRequest(destination: any, number: number, options: any, minEnergy: number) {
        let target;
        let currentDistance = 99;
        let origx = Number(destination.slice(1,3));
        let origy = Number(destination.slice(4,6));
        Object.keys(Game.spawns).forEach(spawnkey => {
            const spawn = Game.spawns[spawnkey];
            let x = Number(spawn.room.name.slice(1,3));
            let y = Number(spawn.room.name.slice(4,6));
            const distance = Math.abs(x - origx) + Math.abs(y - origy);
            if (currentDistance > distance && spawn.room.energyCapacityAvailable >= (minEnergy || 1300)) {
                currentDistance = distance;
                target = spawn;
            }
        });
        if (target) {
            console.log(target.room);
            let i;
            for (i = 0; i < number; i += 1) {
                target.room.memory.requests.push(options);
            }
            return target.room.name;
        } else {
            console.log('PANIC CANT FIND A SPAWN TO USE');
        }
    },
    updateSquadSize(squad: string, size: number) {
        // Corrects the squad against its new size
        // update creeparray to be big enough
        // update comp to be big enough
        const options = {
            'role': Memory.squads[squad].role,
            'squad': squad,
        };
        const diff = size - Memory.squads[squad].size
        Memory.squads[squad].size = size;
        if (diff > 0) {
            brains.buildRequest(Memory.squads[squad].roomTarget, diff, options);
        }
    },
    createSquad(squadName: string, roomTarget: string, size: number, role: string) {
        //check for any reusable dead squads
        // if so, repurpose and resize them
        // else fire off builds
        if (Memory.squads[squadName]) {
            if (Memory.squads[squadName].size < size) {
                brains.updateSquadSize(squadName, size - Memory.squads[squadName].size);
            }
            return
        }
        if (role == 'farm') {
            const options1 = {
                'role': role,
                'myTask': role,
                'squad': squadName,
            };
            const options2 = {
                'role': role,
                'secondaryRole': 'heal',
                'myTask': role,
                'squad': squadName,
            };
            Memory.squads[squadName] = {};
            Memory.squads[squadName].roomTarget = roomTarget;
            Memory.squads[squadName].size = size;
            Memory.squads[squadName].role = role;
            Memory.squads[squadName].creeps = [];
            const stagingRoomname = brains.buildRequest(roomTarget, 1, options2, 5600);
            brains.buildRequest(roomTarget, 1, options1, 5600);
            Memory.squads[squadName].stagingTarget = {
                roomName: stagingRoomname,
                x: 25,
                y: 25,
            };
            return
        }
        let requiredSize = size;
        if (role === 'defcon') {
            Memory.retiredSquads.forEach((squad, index) => {
                // TODO join retired squads together
                if (Memory.squads[squad].creeps.length >= requiredSize) {
                    Memory.squads[squadName] = Object.assign({}, Memory.squads[squad]);
                    delete Memory.squads[squad];
                    Memory.squads[squadName].roomTarget = roomTarget;
                    Memory.squads[squadName].size = size;
                    Memory.squads[squadName].role = role;
                    Memory.retiredSquads.splice(index, index + 1) // always removing elements
                    requiredSize = 0;
                    Memory.squads[squadName].creeps.forEach(creepName => {
                        const creep = Game.creeps[creepName]
                        creep.memory.squad = squadName;
                        creep.memory.role = role;
                        creep.memory.roomTarget = roomTarget;
                    })
                }
            });
        }
        if (requiredSize > 0) {
            const options = {
                'role': role,
                'myTask': role,
                'squad': squadName,
            };
            Memory.squads[squadName] = {};
            Memory.squads[squadName].roomTarget = roomTarget;
            Memory.squads[squadName].size = size;
            Memory.squads[squadName].role = role;
            Memory.squads[squadName].creeps = [];
            const stagingRoomname = brains.buildRequest(roomTarget, size, options);
            Memory.squads[squadName].stagingTarget = {
                roomName: stagingRoomname,
                x: 25,
                y: 25,
            };
        }
    },
    joinSquads(squad1: string, squad2: string) {
        Memory.squads[squad1].creeps = Memory.squads[squad1].creeps.concat(Memory.squads[squad2].creeps);
        brains.updateSquadSize(squad1, Memory.squads[squad1].size + Memory.squads[squad2].size)
    },
    retireSquad(squad: string) {
        // mark task as retired, turn off renewal and replace in the role.
        Memory.squads[squad].role = 'retired';
        Memory.retiredSquads.push(squad);
    },
}

export default brains;
