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
            const creepArray = Memory.squads[squadName].creeps;

            // Always run role to make sure we can control if we need to attack or not
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
            creepArray && creepArray.forEach((creepID, index) => {
                const creep = Game.getObjectById(creepID);
                if (creep) {
                    brains.taskManager(creep);
                } else {
                    Memory.squads[squadName].creeps.splice(index, index + 1);
                }
            });
        }
    },
    buildRequest(destination: any, number: number, options: any) {
        let target;
        let currentDistance = 99;
        let origx = Number(destination.slice(1,3));
        let origy = Number(destination.slice(4,6));
        Object.keys(Game.spawns).forEach(spawnkey => {
            const spawn = Game.spawns[spawnkey];
            let x = Number(spawn.room.name.slice(1,3));
            let y = Number(spawn.room.name.slice(4,6));
            const distance = Math.abs(x - origx) + Math.abs(y - origy);
            if (currentDistance > distance) {
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
            'role': 'ranged',
            'myTask': task,
            'squad': squad,
        };
        brains.buildRequest(Memory.squads[squad].roomTarget, size, options);
    },
    createSquad(squadName: string, roomTarget: string, size: number, task: string) {
        //check for any reusable dead squads
        // if so, repurpose and resize them
        // else fire off builds
        let requiredSize = size;
        Memory.retiredSquads.forEach((squad, index) => {
            // TODO join retired squads together
            if (Memory.squads[squad].size >= requiredSize) {
                Memory.squads[squadName] = Memory.squads[squad];
                delete Memory.squads[squad];

                Memory.retiredSquads.splice(index, index + 1) // always removing elements
                requiredSize = 0;
            }
        });
        if (requiredSize > 0) {
            const options = {
                'role': 'brains',
                'myTask': task,
                'squad': squadName,
            };
            Memory.squads[squadName] = {};
            Memory.squads[squadName].roomTarget = roomTarget;
            Memory.squads[squadName].size = size;
            Memory.squads[squadName].task = task;
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
    taskManager(creep: string) {
        // Add in new modes and fix this healer BS TODO
        if (creep.memory.secondaryTask == 'healer') {
            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            }
        }
        switch(creep.memory.myTask){
            case 'claim':
                return actClaim.run(creep);
            case 'moveToTarget':
                return util.moveToTarget(creep);
            case 'moveToObject':
                return util.moveToObject(creep);
            case 'goToTarget':
                return util.goToTarget(creep);
            case 'repair':
            case 'build':
                return actBuild.run(creep);
            case 'heal':
                return actOffensive.heal(creep);
            case 'attack':
                return actOffensive.attack(creep);
            case 'rangedAttack':
                return actOffensive.rangedAttack(creep);
            case 'block':
                return actOffensive.block(creep);
            case 'gather':
                return actOffensive.gather(creep);
            case 'renew':
                return actOffensive.renew(creep, mySpawns);
            default:
                console.log(creep.name)
                console.log(creep.memory.role)
                console.log('State machine failed, investigate');
                return true;
        }
    },
}

export default brains;
