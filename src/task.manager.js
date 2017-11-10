// @flow
import actDeposit from './action.deposit';
import actResupply from './action.resupply';
import actClaim from './action.claim';
import actHarvest from './action.harvest';
import actUpgrade from './action.upgrade';
import actBuild from './action.build';
import actOffensive from './action.offensive';

import util from './util';

const taskManager = {
    run: function(creep, mySpawns) {
        switch(creep.memory.myTask){
            case 'claim':
                actClaim.run(creep);
                break;
            case 'fetch':
                actResupply.getEnergy(creep);
                break;
            case 'deposit':
                actDeposit.run(creep, creep.memory.role == 'mule' || creep.memory.role == 'thiefmule');
                break;
            case 'lazydeposit':
                actDeposit.lazydeposit(creep);
                break;
            case 'harvest':
                actHarvest.run(creep);
                break;
            case 'harvestMinerals':
                actHarvest.runMinerals(creep);
                break;
            case 'goToTarget':
                util.goToTarget(creep);
                break;
            case 'upgrade':
                actUpgrade.run(creep);
                break;
            case 'resupply':
                actResupply.run(creep);
                break;
            case 'repair':
            case 'build':
                actBuild.run(creep);
                break;
            case 'heal':
                actOffensive.heal(creep);
                break;
            case 'attack':
                actOffensive.attack(creep);
                break;
            case 'rangedAttack':
                actOffensive.rangedAttack(creep);
                break;
            case 'block':
                actOffensive.block(creep);
                break;
            case 'gather':
                actOffensive.gather(creep);
                break;
            case 'renew':
                actOffensive.renew(creep, mySpawns);
                break;
            default:
                switch(creep.memory.role) {
                    case 'worker':
                        creep.memory.myTask = 'resupply';
                        actResupply.run(creep);
                        break;
                    case 'mule':
                        creep.memory.myTask = 'fetch';
                        break;
                    default:
                        creep.memory.myTask = 'harvest';
                        break;
                }
                break;
        }
    }
}

export default taskManager;
