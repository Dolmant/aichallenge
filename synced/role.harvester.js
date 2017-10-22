var actHarvest = require('action.harvest');
var actDeposit = require('action.deposit');


var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.fatigue!=0){
		return;
		}
		
		switch(creep.memory.MyTask){
			case 'harvest'://get more energy
				actHarvest.run(creep);
			break;
			case 'deposit'://go fill somethings energy, this doesnt happen for this harvester!
    			actDeposit.run(creep);
			break;
			default:
				creep.memory.MyTask = 'harvest';
			break;
		}
	}
};

module.exports = roleHarvester;