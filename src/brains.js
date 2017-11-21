const brains = {
    run() {
        /*
        For each creep in each squad
        run offensive actions plus the 'task' role for the squad
        */

        for (let squadName in Memory.squads) {
            Memory.squads[squadName].creeps.forEach(creepID => {
                const creep = Game.getObjectById(creepID)
                if (brains.taskManager(creep)) {
                    switch(Memory.squads[squadName].role){
                        case 'retired':
                            roleOffensive.run(creep);
                            break;
                        case 'defcon':
                            roleOffensive.run(creep);
                            break;
                        case 'guard':
                            roleOffensive.run(creep);
                            break;
                        case 'grinder':
                            roleOffensive.run(creep);
                            break;
                    }
                }
            });
        }
    },
    updateSquadSize(squad: string) {
        // Corrects the squad against its new composition
    },
    createSquad(squad: string, roomTarget: string, size: number, task: string) {
        //check for any reusable dead squads
        // if so, repurpose and resize them
        // else fire off builds
    },
    retireSquad(squad: string, roomTarget: string, size: number, task: string) {
        // mark task as retired, turn off renewal and replace.
    },
    taskManager(creep: string) {
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
