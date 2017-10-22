
var roleMule = {
    
        /** @param {Creep} creep **/
        run: function(creep) {
            if (creep.fatigue != 0){
                return;
            }
            if(creep.memory.myTask != 0 && creep.carry.energy == 0)
            {
                creep.memory.myTask = 0;
                //creep.say('ðŸ”„ FETCH');
            }
            if(creep.memory.myTask !=1 && creep.carry.energy == creep.carryCapacity)
            {
                creep.memory.myTask = 1;
                //creep.say('âš¡ DEAL');
            }
    
            
            switch(creep.memory.myTask){
                case 0://get more energy
                    getEnergy(creep);
                    break;
                case 1://go fill somethings energy
                    depositEnergy(creep);
                    break;
               case 2://we picked up something not energy
                    
                    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_STORAGE) ;
                        }
                    });
                    //console.log(creep.transfer(target));
                    //TODO: figure out what the command for deposit all is
                    if(target != undefined) {
                        creep.moveTo(target);
                       for(const resourceType in creep.carry) {
                            creep.transfer(target, resourceType);
                        }  
                    }
                    else
                    {
                        console.log('line68, mule');
                    }
                    if(_.sum(creep.carry) == creep.carry.energy){
                        creep.memory.MyState = 0;
                    }
                    break;
                default://uhoh
                creep.memory.myTask = 1;
                break;
            }
        }
    };
    function getEnergy(creep)
    {
        if(_.sum(creep.carry) != creep.carry.energy)
        {
            creep.memory.myTask = 2;
        }
        target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if(!target)
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) && (structure.store.energy > creep.carryCapacity-creep.carry.energy);
                        }
            });
            if(target!= undefined) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                getEnergyEmergency(creep);
            }
        }
        else
        {
            if(target) {
                if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                    creep.say('5secRule');
                }
                else
                {
                    //creep.memory.myTask=1;
                }
            }
        }
    }
    function getEnergyEmergency(creep)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE) && (structure.store.energy > creep.carryCapacity-creep.carry.energy);
                    }
            });
            if(target!= undefined) {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                //console.log('Mule couldn\'t find energy');
            }
    }
    function depositEnergy(creep)
    {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
        if(target!=undefined) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE ) && (structure.store.energy + creep.carryCapacity < structure.storeCapacity );
                    }
            });
            if(target != undefined) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType ==STRUCTURE_CONTAINER) && (structure.store.energy + creep.carryCapacity < structure.storeCapacity );
                    }});
                if(target != undefined) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    console.log('ENERGY OVERLOADED CAPTAIN! ');
                }
            }
    
        }
    }
    
    module.exports = roleMule;