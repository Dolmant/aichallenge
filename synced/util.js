var actResupply = require('action.resupply');
var actUpgrade = require('action.upgrade');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.fatigue != 0){
			return;
        }

        if(!(creep.memory.myTask == 'upgrading') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrading';
        }
        if(creep.carry.energy == 0)
        {
            creep.memory.myTask = 'resupply';
        }
        switch (creep.memory.myTask) {
            default:
            case 'upgrading':
                actUpgrade.run(creep);
                break;
            case 'resupply':
                actResupply.run(creep);
                break;
        }
    }
};

module.exports = roleUpgrader;