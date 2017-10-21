var actResupply = require('action.resupply');


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.fatigue!=0){
		return;
		}
        if( creep.memory.MyController == undefined){
            creep.memory.MyController = creep.room.controller.id;
        }
        else
        {
            myUpgrade = Game.getObjectById(creep.memory.MyController);
    	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
    	        creep.memory.upgrading = true;
    	    }
    	    if(creep.memory.upgrading) {
                if(creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myUpgrade, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            if(creep.memory.upgrading && creep.carry.energy == 0)
            {
                creep.say('Resupply');
                creep.memory.upgrading = false;
            }
            if(!creep.memory.upgrading) {
                actResupply.run(creep);
            }
        }
    }
};

module.exports = roleUpgrader;