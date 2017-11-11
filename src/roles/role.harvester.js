// @flow
const roleHarvester = {
    run: function(creep: Creep) {
		if (creep.fatigue != 0){
			return;
        }
        
        if (creep.memory.moveToTargetx) {
            creep.memory.myTask =  "moveToTarget";
        } else if (creep.carry.energy < creep.carryCapacity) {
			creep.memory.myTask = 'harvest';
		} else if (creep.carryCapacity == creep.carry.energy) {
			creep.memory.myTask = 'deposit';
		}
	},
    runExtractor: function(creep: Creep) {
		if (creep.fatigue != 0){
			return;
		}
        if (creep.memory.moveToTargetx) {
            creep.memory.myTask =  "moveToTarget";
        } else if (_.sum(creep.carry) < creep.carryCapacity) {
			creep.memory.myTask = 'harvestMinerals';
		} else if (creep.carryCapacity == _.sum(creep.carry)) {
			creep.memory.myTask = 'deposit';
		}
	}
};

export default roleHarvester;
