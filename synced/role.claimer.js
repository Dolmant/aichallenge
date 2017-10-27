var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (Game.flags['Claim']) {
            let err = creep.claimController(Game.flags['Claim'].room.controller);
            if (err == ERR_INVALID_TARGET) {
                err = creep.attackController(Game.flags['Claim'].room.controller);
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