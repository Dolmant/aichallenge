var actResupply = require('action.resupply');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if( creep.memory.MyController == undefined){
            creep.memory.MyController = creep.room.controller.id;
        }
        myUpgrade = Game.getObjectById(creep.memory.MyController);
        if(!(creep.memory.myTask == 'upgrading') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrading';
        }
        if(creep.carry.energy == 0)
        {
            creep.memory.myTask == 'resupply';
        }
        switch (creep.memory.myTask) {
            default:
            case 'upgrading':
                if(creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myUpgrade, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
            case 'resupply':
                actResupply.run(creep);
                break;
        }
    }
};

module.exports = roleUpgrader;