var actUpgrade = {
    
    /** @param {Creep} creep **/
    
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};
    
module.exports = actUpgrade;
