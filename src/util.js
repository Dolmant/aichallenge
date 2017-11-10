// @flow
const util = {
    goToTarget(creep) {
        var err = 0;
        if (creep.pos.x == 0) {
            err = creep.move(RIGHT);
            if (err != OK) {
                err = creep.move(TOP_RIGHT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_RIGHT);
            }
        } else if (creep.pos.x == 49) {
            err = creep.move(LEFT);
            if (err != OK) {
                err = creep.move(TOP_LEFT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_LEFT);
            }
        } else if (creep.pos.y == 0) {
            err = creep.move(BOTTOM);
            if (err != OK) {
                err = creep.move(BOTTOM_LEFT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_RIGHT);
            }
        } else if (creep.pos.y == 49) {
            err = creep.move(TOP);
            if (err != OK) {
                err = creep.move(TOP_RIGHT);
            }
            if (err != OK) {
                err = creep.move(TOP_LEFT);
            }
        } else if (creep.room.name == creep.memory.goToTarget) {
            delete creep.memory.goToTarget;
            delete creep.memory.myTask;
        } else {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget)), {'maxRooms': 1})
        }
    },
    moveToTarget(creep) {
        if (creep.pos.x == creep.memory.moveToTargetx && creep.pos.y == creep.memory.moveToTargety) {
            delete creep.memory.myTask;
        } else {
            var err = creep.moveTo(creep.memory.moveToTargetx, creep.memory.moveToTargety,{'maxRooms': 1, 'ignoreCreeps': true});
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
            }
        }
    }
};

export default util;