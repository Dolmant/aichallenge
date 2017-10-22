var actHarvest = {
    
        /** @param {Creep} creep **/
        
        /** @param {Creep} creep **/
        run: function(creep) {
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 1) {
                if(creep.harvest(sources[creep.memory.sourceSelect]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creep.memory.sourceSelect]);
                }
            }
            else {
                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            }
        }
        // run: function(creep) {
        //     //find dropped resources
        //     target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        //     if(!target)
        //     {
        //         //if there are no dropped resources, lets find out if I have a set source
        //         if(creep.memory.MySource == undefined)
        //         {
        //             console.log(creep.name + ' Does not have a source yet, re-acquiring');
        //     	    creep.memory.MySource = creep.pos.findClosestByPath(FIND_SOURCES);
        //     	    if (creep.memory.MySource != undefined)
        //     	    {
        //     	        creep.memory.MySource = creep.memory.MySource.id;
        //     	    }
        //     	    else
        //     	    {
        //     	        //can't find a source, do not currently care but this may be usefull later.
        //     	    }
        //         }
        //         else
        //         {
        //             //I already have a source, so just go to it and harvest
        //             var source = Game.getObjectById(creep.memory.MySource)
        //             if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //                 if(creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}})== ERR_NO_PATH){
        //                         creep.memory.MySource == undefined;
        //                         console.log(creep.name  + ' Unable to find path');
        //                         creep.memory.MySource = undefined;
        //                 }
        //             }
        //         }
        //     }
        //     else
        //     {
        //         if(creep.pickup(target) == ERR_NOT_IN_RANGE) 
        //         {
        //             creep.moveTo(target);
        //             creep.say('5secRule'); 
        //         }
        //     }
        // }
    };
    
    module.exports = actHarvest;