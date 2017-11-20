// @flow
var actUpgrade = {
    run: function(creep: Creep) {
        if (creep.memory.MyController == undefined){
            creep.memory.MyController = creep.room.controller && creep.room.controller.id;
        }
        if (creep.carry.energy == 0) {
            // expect state to return to fetch/resupply
            return true;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if (creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveToCacheTarget(myUpgrade);
        }
    }
};
    
export default actUpgrade;
