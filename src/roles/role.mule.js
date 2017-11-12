// @flow

const roleMule = {
    run: function(creep: Creep) {
        if (creep.fatigue != 0){
            return;
        }
        if(_.sum(creep.carry) < creep.carryCapacity) {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
        } else if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }
    }
};

export default roleMule;
