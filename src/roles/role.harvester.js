// @flow
import actHarvest from './../actions/action.harvest';
import actDeposit from './../actions/action.deposit';


const roleHarvester = {
    run: function(creep: Creep) {      
        // TODO FIX THIS BS OR ASSUME YOU WILL ALWAYS BE CALLED AFTER
        if (creep.memory.home && creep.memory.home != creep.room.name) { // This fixes harvester who path out of the room
            creep.memory.myTask =  "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (creep.memory.moveToTargetx) {
            creep.memory.myTask =  "moveToTarget";
        } else if (!creep.carryCapacity || creep.carry.energy < creep.carryCapacity) {
            creep.memory.myTask = 'harvest';
            actHarvest.run(creep);
		} else if (creep.carryCapacity == creep.carry.energy) {
            creep.memory.myTask = 'deposit';
            actDeposit.run(creep, false)
		}
	},
    runExtractor: function(creep: Creep) {
        if (creep.memory.home && creep.memory.home != creep.room.name) { // This fixes harvester who path out of the room
            creep.memory.myTask =  "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (creep.memory.moveToTargetx) {
            creep.memory.myTask =  "moveToTarget";
        } else if (!creep.carryCapacity || _.sum(creep.carry) < creep.carryCapacity) {
			creep.memory.myTask = 'harvestMinerals';
		} else if (creep.carryCapacity == _.sum(creep.carry)) {
			creep.memory.myTask = 'deposit';
		}
	}
};

export default roleHarvester;
