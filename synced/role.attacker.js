var roleAttacker = {
    run(creep, mySpawns) {
        if (Memory.attackers.attacking) {
            // move to and attack
            if (creep.room.name == Memory.attackers.attackRoom.name) {
                if (!creep.memory.attackCreep) {
                    findTarget(creep);
                }
                if (creep.memory.attackCreep) {
                    var target = Game.getObjectById(creep.memory.attackCreep);
                    if (target) {
                        var err = creep.attack(target);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.pos);
                        } else if (err == ERR_INVALID_TARGET) {
                            findTarget(creep);
                        }
                    }
                } else {
                    creep.moveTo(new RoomPosition(Memory.attackers.attackRoom.x, Memory.attackers.attackRoom.y, Memory.attackers.attackRoom.name))
                }
            } else {
                if (!creep.memory.goToTarget) {creep.memory.goToTarget = Memory.attackers.attackRoom.name};
                goToTarget(creep);
            }
        } else {
            if (creep.ticksToLive < 1000) {
                mySpawns[0].memory.renewTarget = creep.id;
                creep.moveTo(mySpawns[0].pos);
            } else {
                creep.moveTo(new RoomPosition(Memory.attackers.marshallRoom.x, Memory.attackers.marshallRoom.y, Memory.attackers.marshallRoom.name))
            }
        }
    },
};

function findTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
    if (!target) {
        target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
    }
    if (target) {
        creep.memory.attackCreep = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

module.exports = roleAttacker;