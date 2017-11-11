// @flow
const actClaim = {
    run: function(creep: Creep) {
        if (creep.room.name == Game.flags['Claim'].pos.roomName) {
            let err = creep.claimController(creep.room.controller);
            if (err == ERR_INVALID_TARGET) {
                err = creep.attackController(creep.room.controller);
            }
            if (err == ERR_INVALID_TARGET) {
                // If the claimers actions are both invalid, might have to reserve here as well? Need logic for reserve on weak rooms anyway
                return true;
            }
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags['Claim'].pos, {'maxRooms': 1});
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                creep.moveTo(Game.flags['Claim'].pos, {'maxRooms': 1});
            }
        } else {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            return true;
        }
	}
};

export default actClaim;
