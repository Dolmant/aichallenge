// @flow
const util = {
    goToTarget(creep) {
        if (creep.pos.x == 0) {
            creep.move(RIGHT);
        } else if (creep.pos.x == 49) {
            creep.move(LEFT);
        } else if (creep.pos.y == 0) {
            creep.move(BOTTOM);
        } else if (creep.pos.y == 49) {
            creep.move(TOP);
        } else if (creep.room.name == creep.memory.goToTarget) {
            delete creep.memory.goToTarget;
            delete creep.memory.myTask;
        } else {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget)))
        }
    }
};

export default util;