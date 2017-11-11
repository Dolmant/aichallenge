// @flow
import util from './util';

const roleClaimer = {
    run: function(creep: Creep) {
		if (creep.fatigue != 0){
			return;
        }

        if (Game.flags['Claim']) {
            creep.memory.myTask = 'claim';
        } else if (creep.memory.myTask) {
            delete creep.memory.myTask;
        }
	}
};

export default roleClaimer;