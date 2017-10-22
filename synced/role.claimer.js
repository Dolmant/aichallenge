var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
		}

		if (creep.memory.claimTarget) {
            const targetRoom = Game.getObjectById(creep.memory.claimTarget);
			if(creep.claimController(targetRoom.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetRoom.controller);
            }
		}
	}
};

module.exports = roleClaimer;