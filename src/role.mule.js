import actDeposit from './action.deposit';

const roleMule = {
    run: function(creep) {
        if (creep.fatigue != 0){
            return;
        }
        if(creep.carry.energy == 0)
        {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
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
                actDeposit.run(creep, true);
                break;
            default://uhoh
                creep.memory.myTask = 'fetch';
                break;
        }
    }
};
function getEnergy(creep) {
    if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
        getTargets(creep);
    }
    var target = 0;
    if (creep.memory.dropTarget) {
        target = Game.getObjectById(creep.memory.dropTarget);
        var err = target && creep.pickup(target);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (err == OK) {
            creep.memory.dropTarget = 0
        } else {
            getTargets(creep);
        }
    } else if (creep.memory.fetchTarget) {
        target = Game.getObjectById(creep.memory.fetchTarget);
        var err = target && creep.withdraw(target, RESOURCE_ENERGY);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (err == OK) {
            creep.memory.fetchTarget = 0
        } else {
            getTargets(creep);
        }
    }
}

export default roleMule;

function getTargets(creep) {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
        creep.memory.dropTarget = target.id;
        creep.memory.fetchTarget = 0;
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
            }
        });
        if (target) {
            creep.memory.fetchTarget = target.id;
            creep.memory.dropTarget = 0;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store.energy > 0;
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
                creep.memory.dropTarget = 0;
            }
        }
    }
}
