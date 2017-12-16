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
                creep.moveToCacheTarget(Game.flags['Claim'].pos);
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                creep.moveToCacheTarget(Game.flags['Claim'].pos);
            }
        } else {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            return true;
        }
	},
    reserve: function(creep: Creep) {
        if (creep.room.name == creep.memory.reserveTarget) {
            let err = creep.reserveController(creep.room.controller);
            if (err == ERR_INVALID_TARGET) {
                err = creep.attackController(creep.room.controller);
            }
            if (err == ERR_INVALID_TARGET) {
                // If the claimers actions are both invalid, might have to reserve here as well? Need logic for reserve on weak rooms anyway
                return true;
            }
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(Game.flags['Claim'].pos);
            }
        } else {
            creep.memory.goToTarget = creep.memory.reserveTarget;
            return true;
        }
	},
};

export default actClaim;
