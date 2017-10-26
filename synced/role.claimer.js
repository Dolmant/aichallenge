var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }
        var claimTarget = creep.memory.claimTarget;
        if (flags['Claim']) {
            const err = creep.claimController(creep.room.controller);
            if (err == ERR_NOT_IN_RANGE || err == ERR_INVALID_TARGET) {
                controllerpos = new RoomPosition(flags['Claim'].pos)
                creep.moveTo(controllerpos);
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                controllerpos = new RoomPosition(flags['Claim'].pos)
                creep.moveTo(controllerpos);
            }
        }
	}
};

module.exports = roleClaimer;