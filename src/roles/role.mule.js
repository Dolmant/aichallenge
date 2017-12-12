// @flow

const roleMule = {
    run: function(creep: Creep) {
        if (creep.fatigue != 0){
            return;
        }
        if (creep.memory.home && creep.memory.home != creep.room.name) {
            creep.memory.myTask =  "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.75) {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
        } else if (_.sum(creep.carry) >= creep.carryCapacity * 0.75) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }
    }
};

export default roleMule;
