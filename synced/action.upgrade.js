var actUpgrade = {
    
    /** @param {Creep} creep **/
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if( creep.memory.MyController == undefined){
            creep.memory.MyController = creep.room.controller.id;
        }
        myUpgrade = Game.getObjectById(creep.memory.MyController);
        if(creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
    
module.exports = actUpgrade;
