// @flow
import actHarvest from './action.harvest';
import actDeposit from './action.deposit';

const roleHarvester = {
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
		}

		if (creep.carry.energy <= 49) {
			creep.memory.myTask = 'harvest';
		}

		if (creep.carryCapacity == creep.carry.energy) {
			creep.memory.myTask = 'deposit';
		}
		
		switch(creep.memory.myTask){
			case 'harvest'://get more energy
				actHarvest.run(creep);
				break;
			case 'deposit':
				actDeposit.run(creep, false);
				break;
			default:
				creep.memory.myTask = 'harvest';
				break;
		}
	}
};

export default roleHarvester;
