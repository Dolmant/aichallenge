// @flow
var actUpgrade = {
    run: function(creep: Creep) {
        if( creep.memory.MyController == undefined){
            creep.memory.MyController = creep.room.controller && creep.room.controller.id;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if(creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, {'maxRooms': 1});
        }
    }
};
    
export default actUpgrade;
