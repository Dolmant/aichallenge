var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }
        var claimTarget = creep.memory.claimTarget;
        if (Game.flags['Claim']) {
            const err = creep.claimController(creep.room.controller);
            if (err == ERR_NOT_IN_RANGE || err == ERR_INVALID_TARGET) {
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