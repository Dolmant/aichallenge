// @flow
import util from './util';


const roleClaimer = {
    run: function(creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (Game.flags['Claim']) {
            if (creep.room.name == Game.flags['Claim'].pos.roomName) {
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
            } else {
                creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
                util.goToTarget(creep);
            }
        }
	}
};

export default roleClaimer;