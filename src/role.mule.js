// @flow

const roleMule = {
    run: function(creep) {
        if (creep.fatigue != 0){
            return;
        }
        if(creep.carry.energy == 0)
        {
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
