// @flow
import util from './../util';

const roleClaimer = {
    run: function(creep: Creep) {
		if (creep.fatigue != 0){
			return;
        }
        // TODO FIX THIS, DONEST TRANSITION
        if (!Game.flags['Claim']) {
            console.log('Please define the claim flag target');
            creep.memory.myTask = '';
        } else if (creep.room.name != Game.flags['Claim'].pos.roomName) {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            creep.memory.myTask = 'goToTarget';
        } else {
            creep.memory.myTask = 'claim';
        }
	}
};

export default roleClaimer;