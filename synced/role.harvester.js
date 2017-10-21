var actHarvest = require('action.harvest');
var actDeposit = require('action.deposit');


var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.fatigue!=0){
		return;
		}
		if(creep.memory.MyTask != 0 && creep.carry.energy == 0)
		{
			creep.memory.MyTask = 0;
			creep.say('harvest');
		}
		if(creep.memory.MyTask !=1 && creep.carry.energy == creep.carryCapacity)
		{
			creep.memory.MyTask = 1;
			creep.say('Resupply');
		}

		
		switch(creep.memory.MyTask){
			case 0://get more energy
				actHarvest.run(creep);
			break;
			case 1://go fill somethings energy
    			actDeposit.run(creep);
			break;
			default://uhoh
			creep.memory.MyTask = 1;
			break;
		}
	}
};

module.exports = roleHarvester;