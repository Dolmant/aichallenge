var actHarvest = require('action.harvest');

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
			default:
				creep.memory.MyTask = 'harvest';
			break;
		}
	}
};

module.exports = roleHarvester;