var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
		}

        if (creep.room.controller.my) {
            creep.moveTo(26, 49);
        } else {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleClaimer;