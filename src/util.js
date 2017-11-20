// @flow
const util = {
    goToTarget(creep: Creep) {
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
        } else if (creep.room.name == creep.memory.goToTarget || !creep.memory.goToTarget) {
            delete creep.memory.goToTarget;
            return true;
        } else {
            creep.moveToCacheTarget(new RoomPosition(25, 25, creep.memory.goToTarget, {'maxRooms': 10}));
        }
    },
    moveToTarget(creep: Creep) {
        if (creep.pos.getRangeTo(creep.memory.moveToTargetx, creep.memory.moveToTargety) <= creep.memory.moveToTargetrange || !creep.memory.moveToTargetx) {
            delete creep.memory.moveToTargetx;
            delete creep.memory.moveToTargety;
            delete creep.memory.moveToTargetrange;
            return true;
        } else {
            var err = creep.moveToCacheTarget(new RoomPosition(creep.memory.moveToTargetx, creep.memory.moveToTargety, creep.room.name));
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.moveToTargetx;
                delete creep.memory.moveToTargety;
                delete creep.memory.moveToTargetrange;
                return true;
            }
        }
    },
    moveToObject(creep: Creep) {
        if (!Game.getObjectById(creep.memory.moveToObject)) {
            return true;
        }
        if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.moveToObject).pos) <= creep.memory.moveToObjectRange) {
            delete creep.memory.moveToObject;
            delete creep.memory.moveToObjectRange;
            return true;
        } else {
            var err = creep.moveToCacheTarget(Game.getObjectById(creep.memory.moveToObject).pos, {'maxRooms': 10});
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.moveToObject;
                delete creep.memory.moveToObjectRange;
                return true;
            }
        }
    }
};

export default util;