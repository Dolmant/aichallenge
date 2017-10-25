
var actDeposit = require('action.deposit');

var roleMule = {
    run: function(creep) {
        if (creep.fatigue != 0){
            return;
        }
        if(creep.carry.energy == 0)
        {
            creep.memory.myTask = 'fetch';
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }

        switch(creep.memory.myTask){
            case 'fetch'://get more energy
                getEnergy(creep);
                break;
            case 'deposit'://go fill somethings energy
                actDeposit(creep, true);
                break;
            default://uhoh
                creep.memory.myTask = 'fetch';
                break;
        }
    }
};
function getEnergy(creep) {
    if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
        var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (target) {
            creep.memory.dropTarget = target.id;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.energy > 100);
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
            }
        }
    }
    if (creep.memory.dropTarget) {
        target = Game.getObjectById(creep.memory.dropTarget);
        if(target && creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    } else if (creep.memory.fetchTarget) {
        target = Game.getObjectById(creep.memory.fetchTarget);
        if(target && creep.withdraw(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }
}

module.exports = roleMule;