// @flow
import actDeposit from './actions/action.deposit';
import actResupply from './actions/action.resupply';
import actClaim from './actions/action.claim';
import actHarvest from './actions/action.harvest';
import actUpgrade from './actions/action.upgrade';
import actBuild from './actions/action.build';
import actOffensive from './actions/action.offensive';

import util from './util';

/**
* Runs the current state and returns the state machine results. A return of true means we need to assign a new task.
*/

const taskManager = {
    run: function(creep: Creep, mySpawns: Array<StructureSpawn>) {
        let cpu = Game.cpu.getUsed();
        switch(creep.memory.myTask){
            case 'claim':
                return actClaim.run(creep);
            case 'fetch':
                return actResupply.getEnergy(creep);
            case 'deposit':
                return actDeposit.run(creep, creep.memory.role == 'mule' || creep.memory.role == 'thiefmule');
            case 'lazydeposit':
                return actDeposit.lazydeposit(creep);
            case 'harvest':
                return actHarvest.run(creep);
            case 'harvestMinerals':
                return actHarvest.runMinerals(creep);
            case 'moveToTarget':
                return util.moveToTarget(creep);
            case 'moveToObject':
                return util.moveToObject(creep);
            case 'goToTarget':
                return util.goToTarget(creep);
            case 'upgrade':
                return actUpgrade.run(creep);
            case 'resupply':
                return actResupply.run(creep);
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
        Memory.stats['room.' + creep.room.name + '.cpu.taskManager'] += Game.cpu.getUsed() - cpu;
    }
}

export default taskManager;
