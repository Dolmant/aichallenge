// @flow
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
	},
    runExtractor: function(creep) {
		if (creep.fatigue != 0){
			return;
		}

		if (_.sum(creep.carry) <= 49) {
			creep.memory.myTask = 'harvestMinerals';
		}

		if (creep.carryCapacity == _.sum(creep.carry)) {
			creep.memory.myTask = 'deposit';
		}
	}
};

export default roleHarvester;
