var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
		}

        if (creep.room.controller.my) {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.claimTarget)));
        } else {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
	}
};

module.exports = roleClaimer;