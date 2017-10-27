var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }
        var claimTarget = creep.memory.claimTarget;
        if (Game.flags['Claim']) {
            let err = creep.claimController(creep.room.controller);
            if (err == ERR_INVALID_TARGET) {
                err = creep.attackController(creep.room.controller);
            }
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags['Claim'].pos);
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                creep.moveTo(Game.flags['Claim'].pos);
            }
        }
	}
};

module.exports = roleClaimer;