module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
        } else if (creep.room.name == creep.memory.goToTarget || !creep.memory.goToTarget) {
            delete creep.memory.goToTarget;
            delete creep.memory.exitCache;
            return true;
        } else {
            if (!creep.memory.exitCache || creep.memory.exitCache.roomName != creep.pos.roomName) {
                const exit = creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget));
                creep.memory.exitCache = {
                    'roomName': exit.roomName,
                    'x': exit.x,
                    'y': exit.y
                };
            }
            creep.moveToCacheTarget(new RoomPosition(creep.memory.exitCache.x, creep.memory.exitCache.y, creep.memory.exitCache.roomName), { 'maxRooms': 1 });
        }
    },
    loiter(creep) {
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
        }
        if (creep.pos.x == 1) {
            err = creep.move(RIGHT);
            if (err != OK) {
                err = creep.move(TOP_RIGHT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_RIGHT);
            }
        } else if (creep.pos.x == 48) {
            err = creep.move(LEFT);
            if (err != OK) {
                err = creep.move(TOP_LEFT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_LEFT);
            }
        } else if (creep.pos.y == 1) {
            err = creep.move(BOTTOM);
            if (err != OK) {
                err = creep.move(BOTTOM_LEFT);
            }
            if (err != OK) {
                err = creep.move(BOTTOM_RIGHT);
            }
        } else if (creep.pos.y == 48) {
            err = creep.move(TOP);
            if (err != OK) {
                err = creep.move(TOP_RIGHT);
            }
            if (err != OK) {
                err = creep.move(TOP_LEFT);
            }
        }
    },
    moveToTarget(creep) {
        if (creep.pos.getRangeTo(creep.memory.moveToTargetx, creep.memory.moveToTargety) <= creep.memory.moveToTargetrange || !creep.memory.moveToTargetx) {
            delete creep.memory.moveToTargetx;
            delete creep.memory.moveToTargety;
            delete creep.memory.moveToTargetrange;
            return true;
        } else {
            var err = creep.moveToCacheTarget(new RoomPosition(creep.memory.moveToTargetx, creep.memory.moveToTargety, creep.room.name), { 'maxRooms': 1 });
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.moveToTargetx;
                delete creep.memory.moveToTargety;
                delete creep.memory.moveToTargetrange;
                return true;
            }
        }
    },
    moveToObject(creep) {
        const target = Game.getObjectById(creep.memory.moveToObject);
        if (!target) {
            return true;
        }
        if (creep.pos.getRangeTo(target.pos) <= creep.memory.moveToObjectRange) {
            delete creep.memory.moveToObject;
            delete creep.memory.moveToObjectRange;
            return true;
        } else {
            if (creep.pos.roomName == target.pos.roomName) {
                creep.memory.moveToTargetx = target.pos.x;
                creep.memory.moveToTargety = target.pos.y;
                creep.memory.moveToTargetrange = creep.memory.moveToObjectRange;
                util.moveToTarget(creep);
            } else {
                creep.memory.goToTarget = target.pos.roomName;
                util.goToTarget(creep);
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (util);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actHarvest = {
    run: function (creep) {
        if (!creep.memory.sourceMap && !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        if (creep.carryCapacity && creep.carry.energy == creep.carryCapacity) {
            // expect state change to deposit
            return true;
        }
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
        if (!source) {
            getSource(creep);
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container.length > 0 && container[0].pos.lookFor(LOOK_CREEPS).length == 0) {
                creep.memory.moveToTargetx = container[0].pos.x;
                creep.memory.moveToTargety = container[0].pos.y;
                creep.memory.moveToTargetrange = 0;
            } else {
                creep.memory.moveToTargetx = source.pos.x;
                creep.memory.moveToTargety = source.pos.y;
                creep.memory.moveToTargetrange = 1;
            }
            // expect state change to movetotarget
            return true;
        }
    },
    runMinerals: function (creep) {
        if (!creep.memory.sourceMap) {
            var nearestSource = creep.pos.findClosestByPath(FIND_MINERALS);
            creep.memory.sourceMap = nearestSource && nearestSource.id;
        }
        if (creep.carryCapacity && _.sum(creep.carry) == creep.carryCapacity) {
            // expect state change to deposit
            return true;
        }
        var source = Game.getObjectById(creep.memory.sourceMap);
        if (!source) {
            return;
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var container = source.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER
            });
            if (container.length > 0) {
                creep.memory.moveToTargetx = container[0].pos.x;
                creep.memory.moveToTargety = container[0].pos.y;
                creep.memory.moveToTargetrange = 0;
            } else {
                creep.memory.moveToTargetx = source.pos.x;
                creep.memory.moveToTargety = source.pos.y;
                creep.memory.moveToTargetrange = 1;
            }
            // expect state to change to movetotarget
            return true;
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.tempSourceMap = nearestSource && nearestSource.id;
}

/* harmony default export */ __webpack_exports__["a"] = (actHarvest);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cron__ = __webpack_require__(6);


const roleThief = {
    run(creep) {
        if (!creep.memory.sourceMap) {
            console.log('thief genned without map');
        }
        if (creep.memory.myTask == 'lazydeposit' && creep.memory.myBuildTarget) {
            creep.memory.myTask = 'build';
        } else if (!creep.carryCapacity || creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.myTask == 'moveToObject' && creep.memory.moveToObject) {
                if (Memory.roomMap && Memory.roomMap[creep.memory.moveToObject]) {
                    creep.memory.goToTarget = Memory.roomMap[creep.memory.moveToObject];
                    creep.memory.myTask = 'goToTarget';
                } else {
                    creep.memory.myTask = 'moveToObject';
                }
            } else if (creep.memory.myTask == 'harvest') {
                //harvest appends these details
                creep.memory.myTask = 'moveToTarget';
            } else {
                creep.memory.myTask = 'harvest';
            }
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'lazydeposit';
        }
    },
    generateStealTarget() {
        // TODO fix !!!!
        let target;
        if (Memory.thieving_spots) {
            __WEBPACK_IMPORTED_MODULE_0__cron__["a" /* default */].run10();
            const targets = Object.keys(Memory.thieving_spots);
            for (var i = 0; i < targets.length; i += 1) {
                if (Memory.thieving_spots[targets[i]] == 0) {
                    return targets[i];
                }
            }
            console.log('no spare thief found, queried: ' + targets.length + ' times');
            return '59bbc4262052a716c3ce7711';
        } else {
            console.log('no thief object, failed');
            return '59bbc4262052a716c3ce7711';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThief);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var actOffensive = {
    heal: function (creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        let alternativeTarget = false;
        if (target) {
            if (creep.hits < creep.hitsMax * 0.9) {
                creep.heal(creep);
            } else {
                const array = creep.pos.findInRange(FIND_MY_CREEPS, 3);
                array.forEach(luckyCreep => {
                    if (!alternativeTarget && luckyCreep.id != target.id && luckyCreep.id != creep.id && luckyCreep.hits < luckyCreep.hitsMax) {
                        creep.rangedHeal(luckyCreep);
                        alternativeTarget = true;
                    }
                });
            }
            if (!alternativeTarget) {
                if (target.hits < target.hitsMax) {
                    var err = creep.heal(target);
                    if (err == ERR_INVALID_TARGET) {
                        delete creep.memory.healCreep;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.rangedHeal(target);
                    }
                }
                creep.moveToCacheTarget(target.pos, { 'maxRooms': 1 });
            }
        } else {
            delete creep.memory.healCreep;
            return true;
        }
    },
    dualAttack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            // removing as enemies on that spot will otherwise be left alone
            // if (target.pos.x != 0 && target.pos.y != 49 && target.pos.x != 49 && target.pos.y != 0) {
            creep.moveToCacheTarget(target.pos, { 'maxRooms': 1 });
            // }
            if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.rangedAttack(target);
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    attack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            creep.moveToCacheTarget(target.pos, { 'maxRooms': 1 });
            if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    rangedAttack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.rangedAttack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(target.pos, { 'maxRooms': 1 });
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.attackCreep;
                return true;
            }
        } else {
            delete creep.memory.attackCreep;
            return true;
        }
    },
    block: function (creep) {
        var block1Flag = Game.flags['blocker1'];
        var block2Flag = Game.flags['blocker2'];
        var block3Flag = Game.flags['blocker3'];
        var err = 0;
        if (!creep.memory.blockTarget && !creep.memory.done) {
            if (block1Flag) {
                err = creep.moveToCacheTarget(block1Flag.pos, { 'maxRooms': 1 });
                if (err == ERR_NO_PATH) {
                    if (block2Flag) {
                        var err = creep.moveToCacheTarget(block2Flag.pos, { 'maxRooms': 1 });
                        if (err == ERR_NO_PATH) {
                            if (block3Flag) {
                                var err = creep.moveToCacheTarget(block3Flag.pos, { 'maxRooms': 1 });
                                if (err == ERR_NO_PATH) {
                                    return;
                                } else {
                                    creep.memory.blockTarget = block3Flag.id;
                                }
                            }
                        } else {
                            creep.memory.blockTarget = block2Flag.id;
                        }
                    }
                } else {
                    creep.memory.blockTarget = block1Flag.id;
                }
            }
        }
        if (creep.memory.blockTarget && !creep.memory.done) {
            var blockTarget = Game.getObjectById(creep.memory.blockTarget);
            if (creep.pos.getRangeTo(blockTarget.pos) <= 1) {
                creep.memory.done = true;
            } else {
                err = creep.moveToCacheTarget(blockTarget.pos, { 'maxRooms': 1 });
                if (err = ERR_NO_PATH) {
                    delete creep.memory.blockTarget;
                }
            }
        }
    },
    gather: function (creep) {
        if (Memory.attackers.attacking) {
            creep.moveToCacheTarget(Game.flags['Attack'].pos, { 'maxRooms': 1 });
            return true;
        } else {
            if (creep.pos.getRangeTo(Game.flags['Marshal'].pos) <= 2) {
                return true;
            } else {
                creep.moveToCacheTarget(Game.flags['Marshal'].pos, { 'maxRooms': 1 });
            }
        }
    },
    renew: function (creep, mySpawns) {
        if (mySpawns[0]) {
            var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
            if (creep.ticksToLive > 1400 || Memory.attackers.attacking) {
                return true;
            }
            if (!mySpawns[0].memory.renewTarget && inRange) {
                mySpawns[0].memory.renewTarget = creep.id;
            } else if (!inRange) {
                creep.moveToCacheTarget(mySpawns[0].pos, { 'maxRooms': 1 });
            }
        }
    },
    findTarget: function (creep) {
        if (creep.memory.role == 'healer') {
            actOffensive.findHealingTarget(creep);
        } else if (creep.memory.role == 'blocker') {
            creep.memory.myTask = 'block';
        } else {
            actOffensive.findAttackTarget(creep);
        }
    },
    findHealingTarget: function (creep) {
        var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            'filter': creep => creep.hits < creep.hitsMax
        });
        if (target) {
            creep.memory.healCreep = target.id;
        } else {
            delete creep.memory.healCreep;
        }
    },
    findDefenceTarget: function (creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: creep => creep.body.filter(part => part.type == ATTACK || part.type == RANGED_ATTACK)
        });
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        }
        if (target) {
            creep.memory.attackCreep = target.id;
        } else {
            delete creep.memory.attackCreep;
        }
    },
    findAttackTarget: function (creep) {
        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {
            filter: creep => creep.body.filter(part => part.type == ATTACK || part.type == RANGED_ATTACK)
        });
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_TOWER
            });
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_SPAWN
            });
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_STORAGE
            });
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        }
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_WALL
            });
        }
        if (target) {
            creep.memory.attackCreep = target.id;
        } else {
            delete creep.memory.attackCreep;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actOffensive);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleThiefMule = {
    run(creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (creep.memory.myTask == 'fetch' && _.sum(creep.carry) == 0) {
            creep.memory.myTask = 'moveToTarget';
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 200
            }) || { pos: { x: 25, y: 25 } };
            creep.memory.moveToTargetx = target.pos.x;
            creep.memory.moveToTargety = target.pos.y;
            creep.memory.moveToTargetrange = 1;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.75 && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        } else if (_.sum(creep.carry) >= creep.carryCapacity * 0.75 && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.5 && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        } else if (_.sum(creep.carry) >= creep.carryCapacity * 0.5 && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThiefMule);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actDeposit = {
    run: function (creep, isMule) {
        //if I'm carrying something that is not energy
        var currentEnergy = creep.carry.energy;
        if (_.sum(creep.carry) == 0) {
            delete creep.memory.depositTarget;
            return true;
        }
        if (_.sum(creep.carry) != currentEnergy) {
            deposit_resource(creep, isMule);
        } else if (!creep.memory.depositTarget) {
            deposit_target(creep, isMule);
        }
        var target = Game.getObjectById(creep.memory.depositTarget);
        if (target) {
            var err = creep.transfer(target, RESOURCE_ENERGY);
            if (err == ERR_INVALID_ARGS) {
                var err = creep.transfer(target, RESOURCE_ENERGY, target.energyCapacity - target.energy || target.storeCapacity && target.storeCapacity - target.store.energy);
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(target.pos);
                // Return early to prevent deletion of the deposit target
                return false;
            } else if (err == OK) {
                // Adjust the promise on this object now it has been delivered
                delete creep.memory.depositTarget;
                if (!creep.room.memory.structures[target.id]) {
                    creep.room.memory.structures[target.id] = {};
                };
                creep.room.memory.structures[target.id].energyRationPromise = 0;
                if (target.structureType == STRUCTURE_EXTENSION || target.structureType == STRUCTURE_SPAWN) {
                    //TODO disabled these two because ration updates arent working
                    if (target.energyCapacity - target.energy > currentEnergy) {
                        creep.room.memory.energyRation -= currentEnergy;
                    } else {
                        creep.room.memory.energyRation -= target.energyCapacity - target.energy;
                    }
                }
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                //expect a return to harvesting or muling here
                delete creep.memory.depositTarget;
                return true;
            } else {
                deposit_target(creep, isMule);
            }
        }
        // important to remove the depositTarget so a new one can be fetched
        delete creep.memory.depositTarget;
    },
    lazydeposit: function (creep) {
        if (creep.memory.lazyContainer) {
            const lazyContainer = Game.getObjectById(creep.memory.lazyContainer);
            if (!creep.carryCapacity || creep.carry.energy == 0) {
                return true;
            }
            if (lazyContainer) {
                var err;
                if (lazyContainer.hits < lazyContainer.hitsMax / 1.05) {
                    err = creep.repair(lazyContainer);
                    if (err == ERR_NOT_ENOUGH_RESOURCES) {
                        return true;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveToCacheTarget(lazyContainer.pos);
                    } else {
                        return true;
                    }
                } else {
                    err = creep.transfer(lazyContainer, RESOURCE_ENERGY);
                    if (err == ERR_FULL || err == ERR_INVALID_ARGS || err == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.drop(RESOURCE_ENERGY);
                        return true;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveToCacheTarget(lazyContainer.pos);
                    } else {
                        return true;
                    }
                }
            } else {
                delete creep.memory.lazyContainer;
            }
        } else {
            var const_site = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (const_site.length > 0) {
                creep.memory.myBuildTarget = const_site[0].id;
                // expect state change to build
                return true;
            } else {
                var container_site = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER
                });
                if (container_site.length > 0) {
                    creep.memory.lazyContainer = container_site[0].id;
                } else {
                    // Could create it on the creep for guanranteed space, but I am pretty sure you cant build on what you are standing on
                    creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
                }
            }
        }
    }
};

function deposit_target(creep, isMule) {
    // Mule is the only one which will refuse to drop to a container
    var economy = creep.room.memory.myCreepCount.muleCount && creep.room.memory.myCreepCount.harvesterCount > 0;
    // We can use local links and containers and rely on mules for transport
    var target = creep.pos.findInRange(FIND_STRUCTURES, 2, {
        'filter': structure => {
            // since links and stores have different energy checking methods, need this long filter to check both
            return structure.structureType == STRUCTURE_LINK && (structure.energy < structure.energyCapacity || structure.storeCapacity && structure.store.energy < structure.storeCapacity);
        },
        'algorithm': 'dijkstra'
    });
    if (target > 0) {
        creep.memory.depositTarget = target[0].id;
        return true;
    }
    if (creep.room.memory.hasContainers && economy && !isMule) {
        // We can use local links and containers and rely on mules for transport
        var target = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            'filter': structure => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return structure.structureType == STRUCTURE_LINK && (structure.energy < structure.energyCapacity || structure.storeCapacity && structure.store.energy < structure.storeCapacity);
            },
            'algorithm': 'dijkstra'
        });
        target = target.length > 0 ? target : creep.pos.findInRange(FIND_STRUCTURES, 1, {
            'filter': structure => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && (structure.energy < structure.energyCapacity || structure.storeCapacity && structure.store.energy < structure.storeCapacity);
            },
            'algorithm': 'dijkstra'
        });
        target = target.length > 0 ? target[0] : creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': structure => {
                // since links and stores have different energy checking methods, need this long filter to check both
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy < structure.energyCapacity || structure.storeCapacity && structure.store.energy < structure.storeCapacity);
            },
            'algorithm': 'dijkstra'
        });
        if (target) {
            creep.memory.depositTarget = target.id;
            return true;
        }
    }

    if (true) {
        //(creep.room.memory.energyRation > 0) {
        // We must deposit to the nearest none full spawn or extension
        // We do declare that this energy will be given. Promise ticks down 1 energy per tick, if it reaches 0
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': structure => {
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity; //&& !(creep.room.memory.structures[structure.id] && (creep.room.memory.structures[structure.id].energyRationPromise >= (structure.energyCapacity - structure.energy))) 
            }
        });
        if (target) {
            if (!creep.room.memory.structures[target.id]) {
                creep.room.memory.structures[target.id] = {};
            };
            creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
            creep.memory.depositTarget = target.id;
            return true;
        }
    }
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': structure => {
            return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
        }
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {
            creep.room.memory.structures[target.id] = {};
        };
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }
    // Otherwise, hand it to the storage for other use.
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': structure => {
            return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity * 0.9 || structure.structureType == STRUCTURE_LINK && structure.energy < structure.energyCapacity || structure.structureType == STRUCTURE_TERMINAL && structure.store.energy < structure.storeCapacity;
        }
    });
    if (target) {
        creep.memory.depositTarget = target.id;
        return true;
    }

    // Failsafe, give it to spawn or extension
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': structure => {
            return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
        }
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {
            creep.room.memory.structures[target.id] = {};
        };
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }

    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        'filter': structure => {
            return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy < structure.storeCapacity;
        }
    });
    if (target) {
        if (!creep.room.memory.structures[target.id]) {
            creep.room.memory.structures[target.id] = {};
        };
        creep.room.memory.structures[target.id].energyRationPromise += creep.carry.energy;
        creep.memory.depositTarget = target.id;
        return true;
    }

    creep.memory.depositTarget = 0;
}

function deposit_resource(creep, isMule) {
    var target;
    if (isMule) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) < structure.storeCapacity;
            }
        });
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) < structure.storeCapacity;
            }
        });
    }
    //TODO: figure out what the command for deposit all is
    var err;
    if (target != undefined) {
        for (const resourceType in creep.carry) {
            err = creep.transfer(target, resourceType);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(target.pos);
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actDeposit);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__brains__ = __webpack_require__(7);


const cronJobs = {
    run() {
        if (!Memory.cronCount) {
            Memory.cronCount = 0;
        }
        Memory.cronCount += 1;
        if (Memory.thieving_spots) {
            Memory.register_thieves = false;
            if (Memory.cronCount % 10 === 0) {
                cronJobs.run10();
            }
            if (Memory.cronCount > 2000) {
                Memory.cronCount -= 2000;
                cronJobs.run2000();
            }
        } else {
            cronJobs.update();
        }

        if (Memory.squad_requests && Memory.squad_requests.length > 0) {
            // requires
            /*
            name
            roomName
            size
            role
            */
            __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].createSquad(Memory.squad_requests[0].squad, Memory.squad_requests[0].roomTarget, Memory.squad_requests[0].size, Memory.squad_requests[0].role);
            Memory.squad_requests.splice(0, 1);
        }
    },
    run10() {
        if (!Memory.thieving_spots) {
            Memory.thieving_spots = {};
        }
        Object.keys(Memory.thieving_spots).forEach(key => {
            if (Memory.thieving_spots[key] && !Game.creeps[Memory.thieving_spots[key]] && !Memory.buildQueue.includes('Thief' + key)) {
                Memory.thieving_spots[key] = 0;
            }
            if (Memory.thieving_spots[key] == 0) {
                var newName = 'Thief' + key;
                var target_room = Memory.roomMap[key];
                Memory.buildQueue.push(newName);
                __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].buildRequest(target_room, 1, {
                    'role': 'thief',
                    'sourceMap': key,
                    'myTask': 'moveToObject',
                    'moveToObject': key,
                    'moveToObjectRange': 1,
                    'name': newName
                });
                Memory.thieving_spots[key] = newName;
                console.log('Build req: ' + newName);
            }
        });
        if (!Memory.thieving_mules) {
            Memory.thieving_mules = {};
        }
        Object.keys(Memory.thieving_mules).forEach(key => {
            if (Memory.thieving_mules[key] && !Game.creeps[Memory.thieving_mules[key]] && !Memory.buildQueue.includes('ThiefMule' + key)) {
                Memory.thieving_mules[key] = 0;
            }
            if (Memory.thieving_mules[key] == 0) {
                var newName = 'ThiefMule' + key;
                var target_room = Memory.roomMap[key];
                var home = Memory.homeMap[Memory.roomMap[key]];
                Memory.buildQueue.push(newName);
                __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].buildRequest(target_room, 1, {
                    'role': 'thiefmule',
                    'myTask': 'goToTarget',
                    'sourceMap': key,
                    'goToTarget': target_room,
                    'stealTarget': target_room,
                    'home': home,
                    'name': newName,
                    'preTask': 'roadWorker'
                });
                Memory.thieving_mules[key] = newName;
                console.log('Build req ' + newName);
            }
        });

        // Reserve thieving rooms
        if (!Memory.reservers) {
            Memory.reservers = {};
        }
        Object.keys(Memory.reservers).forEach(key => {
            if (Memory.reservers[key] && !Game.creeps[Memory.reservers[key]] && !Memory.buildQueue.includes('Reserve' + key)) {
                Memory.reservers[key] = 0;
            }
            if (Memory.reservers[key] == 0) {
                var newName = 'Reserve' + key;
                Memory.buildQueue.push(newName);
                __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].buildRequest(key, 1, {
                    'role': 'reserve',
                    'myTask': 'goToTarget',
                    'reserveTarget': key,
                    'goToTarget': key,
                    'name': newName
                });
                Memory.reservers[key] = newName;
                console.log('Build req ' + newName);
            }
        });

        // Defcon

        const myOwnedRooms = ['W43N53', 'W45N53', 'W41N51', 'W46N52'];
        const myRooms = myOwnedRooms.concat(Memory.possibleTargets);

        myRooms.forEach(roomName => {
            let myRoom = Game.rooms[roomName];
            if (myRoom) {
                var enemyCreeps = myRoom.find(FIND_HOSTILE_CREEPS, {
                    filter: object => {
                        return object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(HEAL) > 0;
                    }
                });
                myRoom.memory.defcon = enemyCreeps.length;
                if (enemyCreeps.length > 0 && myOwnedRooms.includes(roomName)) {
                    myRoom.memory.defcon -= 1;
                }
                if (Memory.squads[roomName + 'defcon']) {
                    if (Memory.squads[roomName + 'defcon'].size != myRoom.memory.defcon && Memory.squads[roomName + 'defcon'].role != 'retired') {
                        __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].updateSquadSize(roomName + 'defcon', myRoom.memory.defcon);
                    }
                } else if (myRoom.memory.defcon > 0) {
                    __WEBPACK_IMPORTED_MODULE_0__brains__["a" /* default */].createSquad(roomName + 'defcon', roomName, myRoom.memory.defcon, 'defcon');
                }
            }
        });
    },
    run2000() {
        Object.keys(Memory.pathCache).forEach(key => {
            Object.keys(Memory.pathCache[key]).forEach(subkey => {
                if (Memory.pathCache[key][subkey].called < 2) {
                    delete Memory.pathCache[key][subkey];
                } else if (Memory.pathCache[key][subkey].called) {
                    Memory.pathCache[key][subkey].called = 0;
                }
            });
        });
        Object.keys(Memory.pathCache).forEach(key => {
            if (Object.keys(Memory.pathCache[key]).length < 1) {
                delete Memory.pathCache[key];
            }
        });
    },
    update() {
        Memory.possibleTargets = ['W37N35', 'W37N33', 'W38N34', 'W38N35', 'W38N33', // W37N34
        'W39N35', 'W39N37', 'W38N36', 'W39N34', 'W38N37', // W39N36
        'W38N32', 'W38N31', 'W37N32', 'W36N31', 'W36N32'];
        const thieving_spots = {
            // FOR W37N34
            // location: W37N35
            '5982fc5db097071b4adbd444': 0,
            '5982fc5db097071b4adbd443': 0,
            // location: W37N33
            '5982fc5db097071b4adbd44b': 0,
            // location: W38N34
            '5982fc51b097071b4adbd2f9': 0,
            // location: W38N35
            '5982fc51b097071b4adbd2f7': 0,
            // location: W38N33
            '5982fc51b097071b4adbd2fc': 0,
            '5982fc51b097071b4adbd2fd': 0,
            // FOR W39N36
            // location: W39N37
            '5982fc45b097071b4adbd1a4': 0,
            // location: W38N37
            '5982fc51b097071b4adbd2ef': 0,
            // location: W38N36
            '5982fc51b097071b4adbd2f2': 0,
            '5982fc51b097071b4adbd2f3': 0,
            // location: W39N35
            '5982fc46b097071b4adbd1ab': 0,
            // location: W39N34
            '5982fc46b097071b4adbd1ad': 0,
            '5982fc46b097071b4adbd1af': 0,
            // FOR W37N31
            // location: W38N32
            '5982fc52b097071b4adbd301': 0,
            // location: W38N31
            '5982fc52b097071b4adbd305': 0,
            '5982fc52b097071b4adbd303': 0,
            // location: W37N32
            '5982fc5db097071b4adbd44e': 0,
            '5982fc5db097071b4adbd450': 0,
            // location: W36N31
            '5982fc6ab097071b4adbd5bc': 0,
            // location: W36N32
            '5982fc69b097071b4adbd5b8': 0,
            // FOR W36N37
            // location: W37N37
            '5982fc5db097071b4adbd43e': 0,
            '5982fc5db097071b4adbd43c': 0,
            // location: W36N38
            '5982fc68b097071b4adbd592': 0,
            '5982fc68b097071b4adbd593': 0,
            // location: W35N38
            '5982fc74b097071b4adbd779': 0,
            '5982fc74b097071b4adbd77a': 0,
            // FOR W35N33
            // location: W36N33
            '5982fc69b097071b4adbd5b6': 0,
            // location: W35N32
            '5982fc75b097071b4adbd79a': 0
        };
        if (!Memory.thieving_spots) {
            Memory.thieving_spots = {};
        }
        Object.keys(thieving_spots).forEach(key => {
            if (!Memory.thieving_spots[key]) {
                Memory.thieving_spots[key] = 0;
            }
        });

        const thieving_mules = {
            // FOR W37N34
            // location: W37N35
            '5982fc5db097071b4adbd444': 0,
            '5982fc5db097071b4adbd443': 0,
            // location: W37N33
            '5982fc5db097071b4adbd44b': 0,
            // location: W38N34
            '5982fc51b097071b4adbd2f9': 0,
            // location: W38N35
            '5982fc51b097071b4adbd2f7': 0,
            // location: W38N33
            '5982fc51b097071b4adbd2fc': 0,
            '5982fc51b097071b4adbd2fd': 0,
            // FOR W39N36
            // location: W39N37
            '5982fc45b097071b4adbd1a4': 0,
            // location: W38N37
            '5982fc51b097071b4adbd2ef': 0,
            // location: W38N36
            '5982fc51b097071b4adbd2f2': 0,
            '5982fc51b097071b4adbd2f3': 0,
            // location: W39N35
            '5982fc46b097071b4adbd1ab': 0,
            // location: W39N34
            '5982fc46b097071b4adbd1ad': 0,
            '5982fc46b097071b4adbd1af': 0,
            // FOR W37N31
            // location: W38N32
            '5982fc52b097071b4adbd301': 0,
            // location: W38N31
            '5982fc52b097071b4adbd305': 0,
            '5982fc52b097071b4adbd303': 0,
            // location: W37N32
            '5982fc5db097071b4adbd44e': 0,
            '5982fc5db097071b4adbd450': 0,
            // location: W36N31
            '5982fc6ab097071b4adbd5bc': 0,
            // location: W36N32
            '5982fc69b097071b4adbd5b8': 0,
            // FOR W36N37
            // location: W37N37
            '5982fc5db097071b4adbd43e': 0,
            '5982fc5db097071b4adbd43c': 0,
            // location: W36N38
            '5982fc68b097071b4adbd592': 0,
            '5982fc68b097071b4adbd593': 0,
            // location: W35N38
            '5982fc74b097071b4adbd779': 0,
            '5982fc74b097071b4adbd77a': 0,
            // FOR W35N33
            // location: W36N33
            '5982fc69b097071b4adbd5b6': 0,
            // location: W35N32
            '5982fc75b097071b4adbd79a': 0
        };
        if (!Memory.thieving_mules) {
            Memory.thieving_mules = {};
        }
        Object.keys(thieving_mules).forEach(key => {
            if (!Memory.thieving_mules[key]) {
                Memory.thieving_mules[key] = 0;
            }
        });

        const resevers = {
            // FOR W37N34
            'W37N35': 0,
            //'W37N33': 0, This has only one energy. Not worth the build time
            //'W38N34': 0, This has only one energy. Not worth the build time
            // 'W38N35': 0, This guy is too far
            // 'W38N33': 0, This guy is too far

            // FOR W39N36
            // 'W39N35': 0, This has only one energy. Not worth the build time
            // 'W39N37': 0, This has only one energy. Not worth the build time
            'W38N36': 0,
            //'W39N34': 0, This guy is too far
            // 'W38N37': 0, This guy is too far

            // FOR W37N31
            // 'W38N32': 0, This guy is too far
            'W38N31': 0,
            'W37N32': 0
            // 'W36N31': 0, This has only one energy. Not worth the build time
            // 'W36N32': 0, This guy is too far
        };

        if (!Memory.reservers) {
            Memory.reservers = {};
        }
        Object.keys(resevers).forEach(key => {
            if (!Memory.reservers[key]) {
                Memory.reservers[key] = 0;
            }
        });

        Memory.roomMap = {
            // FOR W37N34
            // location: W37N35
            '5982fc5db097071b4adbd444': 'W37N35',
            '5982fc5db097071b4adbd443': 'W37N35',
            // location: W37N33
            '5982fc5db097071b4adbd44b': 'W37N33',
            // location: W38N34
            '5982fc51b097071b4adbd2f9': 'W38N34',
            // location: W38N35
            '5982fc51b097071b4adbd2f7': 'W38N35',
            // location: W38N33
            '5982fc51b097071b4adbd2fc': 'W38N33',
            '5982fc51b097071b4adbd2fd': 'W38N33',
            // FOR W39N36
            // location: W39N37
            '5982fc45b097071b4adbd1a4': 'W39N37',
            // location: W38N37
            '5982fc51b097071b4adbd2ef': 'W38N37',
            // location: W38N36
            '5982fc51b097071b4adbd2f2': 'W38N36',
            '5982fc51b097071b4adbd2f3': 'W38N36',
            // location: W39N35
            '5982fc46b097071b4adbd1ab': 'W39N35',
            // location: W39N34
            '5982fc46b097071b4adbd1ad': 'W39N34',
            '5982fc46b097071b4adbd1af': 'W39N34',
            // FOR W37N31
            // location: W38N32
            '5982fc52b097071b4adbd301': 'W38N32',
            // location: W38N31
            '5982fc52b097071b4adbd305': 'W38N31',
            '5982fc52b097071b4adbd303': 'W38N31',
            // location: W37N32
            '5982fc5db097071b4adbd44e': 'W37N32',
            '5982fc5db097071b4adbd450': 'W37N32',
            // location: W36N31
            '5982fc6ab097071b4adbd5bc': 'W36N31',
            // location: W36N32
            '5982fc69b097071b4adbd5b8': 'W36N32',
            // FOR W36N37
            // location: W37N37
            '5982fc5db097071b4adbd43e': 'W37N37',
            '5982fc5db097071b4adbd43c': 'W37N37',
            // location: W36N38
            '5982fc68b097071b4adbd592': 'W36N38',
            '5982fc68b097071b4adbd593': 'W36N38',
            // location: W35N38
            '5982fc74b097071b4adbd779': 'W35N38',
            '5982fc74b097071b4adbd77a': 'W35N38',
            // FOR W35N33
            // location: W36N33
            '5982fc69b097071b4adbd5b6': 'W36N33',
            // location: W35N32
            '5982fc75b097071b4adbd79a': 'W35N32'
        };

        Memory.energyMap = {
            // FOR W37N34
            // location: W37N35
            '5982fc5db097071b4adbd444': 1500,
            '5982fc5db097071b4adbd443': 1500,
            // location: W37N33
            '5982fc5db097071b4adbd44b': 1500,
            // location: W38N34
            '5982fc51b097071b4adbd2f9': 1500,
            // location: W38N35
            '5982fc51b097071b4adbd2f7': 1500,
            // location: W38N33
            '5982fc51b097071b4adbd2fc': 1500,
            '5982fc51b097071b4adbd2fd': 1500,
            // FOR W39N36
            // location: W39N37
            '5982fc45b097071b4adbd1a4': 1500,
            // location: W38N37
            '5982fc51b097071b4adbd2ef': 1500,
            // location: W38N36
            '5982fc51b097071b4adbd2f2': 1500,
            '5982fc51b097071b4adbd2f3': 1500,
            // location: W39N35
            '5982fc46b097071b4adbd1ab': 1500,
            // location: W39N34
            '5982fc46b097071b4adbd1ad': 1500,
            '5982fc46b097071b4adbd1af': 1500,
            // FOR W37N31
            // location: W38N32
            '5982fc52b097071b4adbd301': 1500,
            // location: W38N31
            '5982fc52b097071b4adbd305': 1500,
            '5982fc52b097071b4adbd303': 1500,
            // location: W37N32
            '5982fc5db097071b4adbd44e': 1500,
            '5982fc5db097071b4adbd450': 1500,
            // location: W36N31
            '5982fc6ab097071b4adbd5bc': 1500,
            // location: W36N32
            '5982fc69b097071b4adbd5b8': 1500,
            // FOR W36N37
            // location: W37N37
            '5982fc5db097071b4adbd43e': 1500,
            '5982fc5db097071b4adbd43c': 1500,
            // location: W36N38
            '5982fc68b097071b4adbd592': 1500,
            '5982fc68b097071b4adbd593': 1500,
            // location: W35N38
            '5982fc74b097071b4adbd779': 1500,
            '5982fc74b097071b4adbd77a': 1500,
            // FOR W35N33
            // location: W36N33
            '5982fc69b097071b4adbd5b6': 1500,
            // location: W35N32
            '5982fc75b097071b4adbd79a': 1500
        };

        Memory.homeMap = {
            'W37N35': 'W37N34',
            'W37N33': 'W37N34',
            'W38N34': 'W37N34',
            'W38N35': 'W37N34',
            'W38N33': 'W37N34',
            'W39N35': 'W39N36',
            'W39N37': 'W39N36',
            'W38N36': 'W39N36',
            'W39N34': 'W39N36',
            'W38N37': 'W39N36',
            'W38N32': 'W37N31',
            'W38N31': 'W37N31',
            'W37N32': 'W37N31',
            'W36N31': 'W37N31',
            'W37N37': 'W36N37',
            'W36N38': 'W36N37',
            'W35N38': 'W36N37',
            'W36N32': 'W35N33',
            'W36N33': 'W35N33',
            'W35N32': 'W35N33'
        };
    }
};

/* harmony default export */ __webpack_exports__["a"] = (cronJobs);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_build__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_action_offensive__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util__ = __webpack_require__(0);






const brains = {
    run() {
        /*
        For each creep in each squad
        run offensive actions plus the 'task' role for the squad
        */
        for (let squadName in Memory.squads) {
            let creepArray = Memory.squads[squadName].creeps;

            if (Memory.squads[squadName].size == 0) {
                if (creepArray.length == 0) {
                    const indexer = Memory.retiredSquads.indexOf(squadName);
                    if (indexer != -1) {
                        Memory.retiredSquads.splice(indexer, indexer + 1);
                    }
                    delete Memory.squads[squadName];
                    continue;
                }
                if (Memory.squads[squadName].role != 'retired') {
                    brains.retireSquad(squadName);
                }
            }

            // Always run role to make sure we can control if we need to attack or not
            creepArray && creepArray.forEach((creepID, index) => {
                if (Memory.squads[squadName]) {
                    const creep = Game.creeps[creepID];
                    if (creep) {
                        switch (Memory.squads[squadName].role) {
                            case 'retired':
                                __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__["a" /* default */].retired(creep);
                                break;
                            case 'farm':
                                __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__["a" /* default */].farm(creep);
                                break;
                            case 'defcon':
                                __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__["a" /* default */].defcon(creep);
                                break;
                            case 'guard':
                                __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__["a" /* default */].guard(creep);
                                break;
                            case 'grinder':
                                __WEBPACK_IMPORTED_MODULE_0__roles_role_offensive__["a" /* default */].grinder(creep);
                                break;
                        }
                        if ((creep.ticksToLive < 350 || creep.memory.forceRevive) && creep.memory.secondaryRole === 'heal' && Memory.squads[squadName].role === 'farm' && !creep.memory.revived) {
                            creepArray.forEach(squadCreepID => {
                                const squadCreep = Game.creeps[squadCreepID];
                                if (squadCreep) {
                                    squadCreep.memory.revived = true;
                                }
                            });
                            console.log('pushing new squad now');
                            Memory.squad_requests.push({
                                'squad': Memory.squads[squadName].roomTarget + 'farm' + Game.time,
                                'role': 'farm',
                                'roomTarget': Memory.squads[squadName].roomTarget,
                                'size': 2
                            });
                        }
                    } else {
                        if (Memory.squads[squadName].role === 'farm') {
                            let revived = false;
                            creepArray.forEach(squadCreepID => {
                                const squadCreep = Game.creeps[squadCreepID];
                                if (squadCreep && !squadCreep.memory.revived && !revived) {
                                    console.log('reviving squad before deleting');
                                    revived = true;
                                    Memory.squad_requests.push({
                                        'squad': Memory.squads[squadName].roomTarget + 'farm' + Game.time,
                                        'role': 'farm',
                                        'roomTarget': Memory.squads[squadName].roomTarget,
                                        'size': 2
                                    });
                                }
                            });
                            console.log('deleting: ' + squadName);
                            console.log('creep: ' + creepID);
                            delete Memory.squads[squadName];
                        } else {
                            Memory.squads[squadName].creeps.splice(index, index + 1);
                            if (Memory.squads[squadName].role != 'retired') {
                                const options = {
                                    'role': Memory.squads[squadName].role,
                                    'myTask': Memory.squads[squadName].role,
                                    'squad': squadName
                                };
                                brains.buildRequest(Memory.squads[squadName].roomTarget, 1, options);
                            }
                        }
                    }
                }
            });
        }
    },
    buildRequest(destination, number, options, minEnergy) {
        let target;
        let currentDistance = 99;
        let origx = Number(destination.slice(1, 3));
        let origy = Number(destination.slice(4, 6));
        Object.keys(Game.spawns).forEach(spawnkey => {
            const spawn = Game.spawns[spawnkey];
            let x = Number(spawn.room.name.slice(1, 3));
            let y = Number(spawn.room.name.slice(4, 6));
            const distance = Math.abs(x - origx) + Math.abs(y - origy);
            if (currentDistance > distance && spawn.room.energyCapacityAvailable >= (minEnergy || 1300)) {
                currentDistance = distance;
                target = spawn;
            }
        });
        if (target) {
            console.log(target.room);
            let i;
            for (i = 0; i < number; i += 1) {
                target.room.memory.requests.push(options);
            }
            return target.room.name;
        } else {
            console.log('PANIC CANT FIND A SPAWN TO USE');
        }
    },
    updateSquadSize(squad, size) {
        // Corrects the squad against its new size
        // update creeparray to be big enough
        // update comp to be big enough
        const options = {
            'role': Memory.squads[squad].role,
            'squad': squad
        };
        const diff = size - Memory.squads[squad].size;
        Memory.squads[squad].size = size;
        if (diff > 0) {
            brains.buildRequest(Memory.squads[squad].roomTarget, diff, options);
        }
    },
    createSquad(squadName, roomTarget, size, role) {
        //check for any reusable dead squads
        // if so, repurpose and resize them
        // else fire off builds
        if (Memory.squads[squadName]) {
            if (Memory.squads[squadName].size < size) {
                brains.updateSquadSize(squadName, size);
            }
            return;
        }
        if (role == 'farm') {
            const options1 = {
                'role': role,
                'myTask': role,
                'squad': squadName
            };
            const options2 = {
                'role': role,
                'secondaryRole': 'heal',
                'myTask': role,
                'squad': squadName
            };
            Memory.squads[squadName] = {};
            Memory.squads[squadName].roomTarget = roomTarget;
            Memory.squads[squadName].size = size;
            Memory.squads[squadName].role = role;
            Memory.squads[squadName].creeps = [];
            const stagingRoomname = brains.buildRequest(roomTarget, 1, options2, 5600);
            brains.buildRequest(roomTarget, 1, options1, 5600);
            Memory.squads[squadName].stagingTarget = {
                roomName: stagingRoomname,
                x: 25,
                y: 25
            };
            return;
        }
        let requiredSize = size;
        if (role === 'defcon') {
            Memory.retiredSquads.forEach((squad, index) => {
                // TODO join retired squads together
                if (Memory.squads[squad] && Memory.squads[squad].creeps.length >= requiredSize) {
                    Memory.squads[squadName] = Object.assign({}, Memory.squads[squad]);
                    delete Memory.squads[squad];
                    Memory.squads[squadName].roomTarget = roomTarget;
                    Memory.squads[squadName].size = size;
                    Memory.squads[squadName].role = role;
                    Memory.retiredSquads.splice(index, index + 1); // always removing elements
                    requiredSize = 0;
                    Memory.squads[squadName].creeps.forEach(creepName => {
                        const creep = Game.creeps[creepName];
                        creep.memory.squad = squadName;
                        creep.memory.role = role;
                        creep.memory.roomTarget = roomTarget;
                    });
                }
            });
        }
        if (requiredSize > 0) {
            const options = {
                'role': role,
                'myTask': role,
                'squad': squadName
            };
            Memory.squads[squadName] = {};
            Memory.squads[squadName].roomTarget = roomTarget;
            Memory.squads[squadName].size = size;
            Memory.squads[squadName].role = role;
            Memory.squads[squadName].creeps = [];
            const stagingRoomname = brains.buildRequest(roomTarget, size, options);
            Memory.squads[squadName].stagingTarget = {
                roomName: stagingRoomname,
                x: 25,
                y: 25
            };
        }
    },
    joinSquads(squad1, squad2) {
        Memory.squads[squad1].creeps = Memory.squads[squad1].creeps.concat(Memory.squads[squad2].creeps);
        brains.updateSquadSize(squad1, Memory.squads[squad1].size + Memory.squads[squad2].size);
    },
    retireSquad(squad) {
        // mark task as retired, turn off renewal and replace in the role.
        Memory.squads[squad].role = 'retired';
        Memory.retiredSquads.push(squad);
    }
};

/* harmony default export */ __webpack_exports__["a"] = (brains);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__ = __webpack_require__(3);



const roleOffensive = {
    guard(creep) {
        /*
        if not in target room
            goto target room
        else 
            if hostile within 5
                attack hostile
            else
                head to roomnameguard flag
        */
        const mySquad = creep.memory.squad;
        // if (creep.ticksToLive < 300 || creep.memory.myTask == 'renew') {
        //     creep.memory.myTask = 'renew';
        if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            var hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
            if (hostiles.length > 0) {
                creep.memory.myTask = 'attack';
                creep.memory.attackCreep = hostiles[0].id;
            } else {
                if (Game.flags[mySquad]) {
                    creep.memory.moveToTargetx = Game.flags[mySquad].pos.x;
                    creep.memory.moveToTargety = Game.flags[mySquad].pos.y;
                    creep.memory.moveToTargetrange = 0;
                } else {
                    creep.memory.moveToTargetx = 25;
                    creep.memory.moveToTargety = 25;
                    creep.memory.moveToTargetrange = 0;
                }
                creep.memory.myTask = 'moveToTarget';
            }
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
        }
    },
    farm(creep) {
        /*
        if staging
            head to staging point
        else 
            if not in target
                goto target
            else 
                if hostiles and attacker
                    attack nearest hostile
                else
                    head to spawer with lowest timer
                    if healer, heal me or buddy
                
        */

        const mySquad = creep.memory.squad;
        let allSpawned = 0;
        Memory.squads[mySquad].creeps.forEach(squadCreep => {
            if (Game.creeps[squadCreep] && !Game.creeps[squadCreep].spawning) {
                allSpawned += 1;
            }
        });
        if (Memory.squads[mySquad].size > allSpawned) {
            creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            creep.memory.moveToTargetrange = 0;
            creep.memory.myTask = 'moveToTarget';
        } else if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            if (!(creep.memory.secondaryRole == 'heal')) {
                if (!creep.memory.attackCreep) {
                    __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__["a" /* default */].findDefenceTarget(creep);
                }
                if (!creep.memory.attackCreep) {
                    const NPCSpawns = creep.room.find(FIND_HOSTILE_STRUCTURES);
                    let cooldown = 999;
                    let target;
                    NPCSpawns.forEach(spawner => {
                        if (spawner.ticksToSpawn < cooldown) {
                            cooldown = spawner.ticksToSpawn;
                            target = spawner;
                        }
                    });
                    if (target) {
                        creep.memory.moveToTargetx = target.pos.x;
                        creep.memory.moveToTargety = target.pos.y;
                        creep.memory.moveToTargetrange = 0;
                        creep.memory.myTask = 'moveToTarget';
                    }
                } else {
                    creep.memory.myTask = 'dualAttack';
                }
            } else {
                if (!creep.healCreep) {
                    let healCreep;
                    Memory.squads[mySquad].creeps.forEach(squadCreep => {
                        if (squadCreep != creep.name) {
                            healCreep = Game.creeps[squadCreep].id;
                        }
                    });
                    creep.memory.healCreep = healCreep;
                }
                creep.memory.myTask = 'heal';
            }
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
        }
    },
    retired(creep) {
        /*
        goto staging
        */
        const mySquad = creep.memory.squad;
        if (creep.room.name == Memory.squads[mySquad].stagingTarget.roomName) {
            creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            creep.memory.moveToTargetrange = 0;
            creep.memory.myTask = 'moveToTarget';
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = Memory.squads[mySquad].stagingTarget.roomName;
        }
    },
    grinder(creep) {
        /*
        if not in target 
            if health max
                goto target
            else heal self
        else 
            if health less than 90 and 5 < y < 45  and 5 < x < 45
                goto staging
            else
                heal self
                attack closest
        */
        const mySquad = creep.memory.squad;
        if (creep.room.name == Memory.squads[mySquad].roomTarget) {
            if (creep.hits < creep.hitsMax * 0.85 || creep.hits < creep.hitsMax * 0.9 && 5 < creep.pos.x && creep.pos.x < 45 && 5 < creep.pos.y && creep.pos.y < 45) {
                creep.memory.myTask = 'goToTarget';
                creep.heal(creep);
                creep.memory.attackCreep = 0;
                creep.memory.goToTarget = Memory.squads[mySquad].stagingTarget.roomName;
            } else {
                creep.heal(creep);
                if (!creep.memory.attackCreep) {
                    let hostiles = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                    let hostile_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                    let target;
                    if (!hostiles && hostile_structures) {
                        target = hostile_structures;
                    } else if (!hostile_structures && hostiles) {
                        target = hostiles;
                    } else {
                        target = creep.pos.findClosestByPath([hostiles, hostile_structures]);
                    }
                    creep.memory.attackCreep = target.id;
                    creep.memory.myTask = 'attack';
                    creep.memory.counter = 1 + creep.memory.counter;
                } else if (creep.memory.counter < 10 && creep.memory.counter < 2) {
                    creep.memory.counter = 1 + creep.memory.counter;
                    creep.memory.myTask = 'loiter';
                } else {
                    creep.memory.myTask = 'attack';
                    creep.memory.counter = 1 + creep.memory.counter;
                }
            }
        } else {
            if (creep.hits < creep.hitsMax) {
                if (!creep.memory.attackCreep) {
                    __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__["a" /* default */].findDefenceTarget(creep);
                }
                creep.heal(creep);
                creep.memory.myTask = 'loiter';
            } else if (creep.memory.attackCreep) {
                creep.memory.myTask = 'attack';
            } else {
                creep.memory.counter = 0;
                creep.memory.myTask = 'goToTarget';
                creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
            }
        }
    },
    defcon(creep) {
        /*
        if not all creeps
            goto staging
        else
            if not in target
                goto target
            else 
                attack any hostiles in the room
        */

        const mySquad = creep.memory.squad;
        if (Memory.squads[mySquad]) {
            // if (Memory.squads[mySquad].size > Memory.squads[mySquad].creeps.length) {
            //     creep.memory.moveToTargetx = Memory.squads[mySquad].stagingTarget.x;
            //     creep.memory.moveToTargety = Memory.squads[mySquad].stagingTarget.y;
            //     creep.memory.moveToTargetrange = 0;
            //     creep.memory.myTask = 'moveToTarget';
            if (creep.room.name == Memory.squads[mySquad].roomTarget) {
                if (!creep.memory.attackCreep) {
                    __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__["a" /* default */].findDefenceTarget(creep);
                }
                creep.memory.myTask = 'attack';
            } else {
                creep.memory.myTask = 'goToTarget';
                creep.memory.goToTarget = Memory.squads[mySquad].roomTarget;
            }
        } else {
            console.log('EXTREME ERROR, DEFCON CREEP HAS WRONG SQUAD');
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleOffensive);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actBuild = {
    run: function (creep) {
        //do I already have something to build? If not find something to fix and say fixit
        if (!creep.memory.myBuildTarget && !creep.memory.myRepairTarget) {
            findBuildTarget(creep);
            if (!creep.memory.myBuildTarget) {
                // expect state change to upgrade
                return true;

                // towers can repair instead
                // findRepairTarget(creep);
                // if (!creep.memory.myRepairTarget) {
                // }
            }
        } else {
            if (creep.memory.myBuildTarget) {
                var target = Game.getObjectById(creep.memory.myBuildTarget);
                if (!target) {
                    findBuildTarget(creep);
                } else {
                    var err = creep.build(target);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.moveToCacheTarget(target.pos);
                    } else if (err == ERR_NOT_ENOUGH_RESOURCES || err == ERR_RCL_NOT_ENOUGH || err == ERR_INVALID_TARGET) {
                        // expect state change to resupply
                        return true;
                    }
                }
            } else if (creep.memory.myRepairTarget) {
                target: Structure = Game.getObjectById(creep.memory.myRepairTarget);
                var err = creep.repair(target);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveToCacheTarget(target.pos);
                } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    //expect state change to resupply
                    return true;
                }
                if (!target || target.hits == target.hitsMax) {
                    findBuildTarget(creep);
                    findRepairTarget(creep);
                }
            }
        }
    },
    roadWorks: function (creep) {
        if (creep.carry.energy > creep.carryCapacity * 0.5) {
            const constSites = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            const structs = creep.pos.lookFor(LOOK_STRUCTURES);
            let target;
            let err = 1;
            if (constSites.length > 0) {
                target = constSites[0];
                err = creep.build(target);
            } else if (structs.length > 0) {
                structs.forEach(struct => {
                    if (!target && struct.structureType == STRUCTURE_ROAD && struct.hits < struct.hitsMax * 0.8) {
                        target = struct;
                        err = creep.repair(struct);
                    }
                });
            }
            if (target && err == OK) {
                return true;
            }
        }
        return false;
    }
};

function findBuildTarget(creep) {
    var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    creep.memory.myBuildTarget = target && target.id;
}
// not used currently
function findRepairTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: s => s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART && s.hits < s.hitsMax
    });

    creep.memory.myRepairTarget = target && target.id;
}

/* harmony default export */ __webpack_exports__["a"] = (actBuild);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actClaim = {
    run: function (creep) {
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
    reserve: function (creep) {
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
                creep.moveToCacheTarget(creep.room.controller.pos);
            }
        } else {
            creep.memory.goToTarget = creep.memory.reserveTarget;
            return true;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actClaim);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loop"] = loop;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__room__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cron__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__brains__ = __webpack_require__(7);



// docs:
/*
place a flag names 'Attack' to designate the attack room and location
place a flag names 'Marshal' to designate a staging area.
To specify size, change forceSize on the Memory.attackers object
To tell a room to marshal a force, change the room flag 'marshalForce' to true
You can send a worker to another room by specifying the roomname on goToTarget and change their task name to goToTarget (make this global)

You can claim by placing a Claim flag setting myRoom.memory.spawnClaimer to the number of claimers you want
*/

Creep.prototype.moveToCacheXY = function (x, y, options) {
    const dest = new RoomPosition(x, y, this.room.name);
    return this.moveToCacheTarget(dest, options);
};
Creep.prototype.moveToCacheTarget = function (target, options) {
    // check cache
    const checkCpu = Game.cpu.getUsed();
    const dest = target.roomName + target.x + target.y;
    const from = this.pos.roomName + this.pos.x + this.pos.y;
    let moveopts = {
        'maxRooms': 1,
        'ignoreCreeps': true,
        'serialize': true
    };
    if (this.fatigue > 0) {
        return -11;
    }

    if (this.memory.pathCache && this.memory.targetCache === dest) {
        if (this.memory.currentCache === from) {
            delete this.memory.currentCache;
            delete this.memory.pathCache;
            delete this.memory.targetCache;
            if (Memory.pathCache[dest] && Memory.pathCache[dest][from]) {
                delete Memory.pathCache[dest][from];
            }
            Memory.stats['cpu.cache_miss_temp'] += 1;
            return this.moveToCacheTarget(target, Object.assign({ 'ignoreCreeps': false }, options));
        }
        this.memory.currentCache = from;
    } else if (Memory.pathCache[dest] && Memory.pathCache[dest][from]) {
        Memory.pathCache[dest][from].called += 1;
        this.memory.pathCache = Memory.pathCache[dest][from].path;
        this.memory.targetCache = dest;
    } else {
        Memory.stats['cpu.cache_miss_temp'] += 1;
        if (options) {
            moveopts = Object.assign(moveopts, options);
        }
        const path = this.room.findPath(this.pos, target, moveopts);
        if (!path) {
            Memory.stats['cpu.pathfinding_temp'] += Game.cpu.getUsed() - checkCpu;
            return -5;
        }
        if (!Memory.pathCache[dest]) {
            Memory.pathCache[dest] = {};
        }
        Memory.pathCache[dest][from] = {
            path,
            called: 0
        };
        this.memory.pathCache = Memory.pathCache[dest][from].path;
        this.memory.targetCache = dest;
    }
    var err = this.moveByPath(this.memory.pathCache);
    if (err == ERR_NOT_FOUND) {
        delete this.memory.currentCache;
        delete this.memory.pathCache;
        delete this.memory.targetCache;
        if (Memory.pathCache[dest] && Memory.pathCache[dest][from]) {
            delete Memory.pathCache[dest][from];
        }
    }
    Memory.stats['cpu.pathfinding_temp'] += Game.cpu.getUsed() - checkCpu;
    return err;
};

function loop() {
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    Memory.stats['cpu.zeroed'] = Game.cpu.getUsed();
    Memory.stats['cpu.pathfinding_temp'] = 0;
    Memory.stats['cpu.cache_miss_temp'] = 0;
    Memory.stats['cpu.links_temp'] = 0;
    Memory.stats['cpu.runTowers_temp'] = 0;
    Memory.stats['cpu.roomUpdateConsts_temp'] = 0;
    Memory.stats['cpu.roomInit_temp'] = 0;

    Memory.stats['cpu.cron_temp'] = Game.cpu.getUsed();
    __WEBPACK_IMPORTED_MODULE_1__cron__["a" /* default */].run();
    Memory.stats['cpu.cron'] = Game.cpu.getUsed() - Memory.stats['cpu.cron_temp'];
    Memory.misc.globalCreepsTemp = {
        'healer': 0,
        'melee': 0,
        'ranged': 0,
        'thief': 0,
        'thiefmule': 0,
        'claimer': 0,
        'tough': 0,
        'blocker': 0
    };
    // Lets keep this around just in case?
    // for(let name in Memory.rooms)
    // {
    // 	if(Game.rooms[name]==undefined)
    // 	{
    // 		delete Memory.rooms[name];
    // 	}
    // }

    // for dashboard
    if (Memory.stats == undefined) {
        Memory.stats = {};
    }

    var rooms = Game.rooms;
    for (let roomKey in rooms) {
        let room = Game.rooms[roomKey];
        var isMyRoom = room.controller ? room.controller.my : 0;
        if (isMyRoom) {
            Memory.stats['room.' + room.name + '.myRoom'] = 1;
            Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
            Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
            Memory.stats['room.' + room.name + '.controllerSpeed'] = room.controller.progress - Memory.stats['room.' + room.name + '.controllerProgress'];
            Memory.stats['room.' + room.name + '.controllerProgress'] = room.controller.progress;
            Memory.stats['room.' + room.name + '.controllerProgressTotal'] = room.controller.progressTotal;
            var stored = 0;
            var storedTotal = 0;

            if (room.storage) {
                stored = room.storage.store[RESOURCE_ENERGY];
                storedTotal = room.storage.storeCapacity[RESOURCE_ENERGY];
            } else {
                stored = 0;
                storedTotal = 0;
            }
            Memory.stats['room.' + room.name + '.storedEnergy'] = stored;
        } else {
            Memory.stats['room.' + room.name + '.myRoom'] = undefined;
        }
    }
    Memory.stats['gcl.progress'] = Game.gcl.progress;
    Memory.stats['gcl.progressTotal'] = Game.gcl.progressTotal;
    Memory.stats['gcl.level'] = Game.gcl.level;

    Memory.stats['cpu.roomController_temp'] = Game.cpu.getUsed();

    __WEBPACK_IMPORTED_MODULE_2__brains__["a" /* default */].run();

    for (let roomName in Game.rooms) {
        let Room = Game.rooms[roomName];
        __WEBPACK_IMPORTED_MODULE_0__room__["a" /* default */].run(Room);
    }
    Memory.stats['cpu.roomController'] = Game.cpu.getUsed() - Memory.stats['cpu.roomController_temp'];

    Memory.misc.globalCreeps = {
        'healer': Memory.misc.globalCreepsTemp.healer,
        'ranged': Memory.misc.globalCreepsTemp.ranged,
        'melee': Memory.misc.globalCreepsTemp.melee,
        'thief': Memory.misc.globalCreepsTemp.thief,
        'thiefmule': Memory.misc.globalCreepsTemp.thiefmule,
        'claimer': Memory.misc.globalCreepsTemp.claimer,
        'tough': Memory.misc.globalCreepsTemp.tough,
        'blocker': Memory.misc.globalCreepsTemp.blocker
    };

    Memory.stats['cpu.pathfinding'] = Memory.stats['cpu.pathfinding_temp'];
    Memory.stats['cpu.cache_miss'] = Memory.stats['cpu.cache_miss_temp'];
    Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();
    Memory.stats['cpu.bucket'] = Game.cpu.bucket;
    Memory.stats['cpu.limit'] = Game.cpu.limit;
    Memory.stats['cpu.links'] = Memory.stats['cpu.links_temp'];
    Memory.stats['cpu.runTowers'] = Memory.stats['cpu.runTowers_temp'];
    Memory.stats['cpu.roomUpdateConsts'] = Memory.stats['cpu.roomUpdateConsts_temp'];
    Memory.stats['cpu.roomInit'] = Memory.stats['cpu.roomInit_temp'];
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__roles_role_upgrader__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__roles_role_harvester__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__roles_role_mule__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__roles_role_worker__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__roles_role_claimer__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__roles_role_thief__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__roles_role_thiefmule__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__roles_role_offensive__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__spawner__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__task_manager__ = __webpack_require__(20);

// import * as profiler from './screeps-profiler';














// profiler.registerObject(roleUpgrader, 'upgrader');
// profiler.registerObject(roleHarvester, 'harvester');
// profiler.registerObject(roleMule, 'mule');
// profiler.registerObject(roleWorker, 'worker');
// profiler.registerObject(roleClaimer, 'claimer');
// profiler.registerObject(roleThief, 'thief');
// profiler.registerObject(roleOffensive, 'run');

const RoomController = {
    run: function (myRoom) {
        const SroomInit = Game.cpu.getUsed();
        if (myRoom.memory.timer == undefined) {
            initializeRoomConsts(myRoom);
        } else {
            myRoom.memory.timer++;
        }

        var myCreeps = myRoom.find(FIND_MY_CREEPS);

        var mySpawns = myRoom.find(FIND_MY_SPAWNS);

        var myCreepCount = {
            'sourceMap': {},
            'harvesterParts': 0,
            'harvesterExtractorParts': 0,
            'upgraderParts': 0,
            'workerParts': 0,
            'muleParts': 0,
            'claimParts': 0,
            'thiefParts': 0,
            'meleeParts': 0,
            'rangedParts': 0,
            'healerParts': 0,
            'toughParts': 0,
            'blockerParts': 0,
            'harvesterCount': 0,
            'harvesterLowCount': 0,
            'harvesterExtractorCount': 0,
            'upgraderCount': 0,
            'workerCount': 0,
            'muleCount': 0,
            'claimCount': 0,
            'thiefCount': 0,
            'meleeCount': 0,
            'rangedCount': 0,
            'healerCount': 0,
            'toughCount': 0,
            'blockerCount': 0
        };

        var totalCreeps = 0;
        myCreeps.forEach(creep => {
            totalCreeps += 1;
            //TODO fix this count
            var creep_size = creep.body.filter(part => part.type == WORK).length;
            myCreepCount.sourceMap[creep.memory.sourceMap] = 1 + (myCreepCount.sourceMap[creep.memory.sourceMap] || 0);
            switch (creep.memory.role) {
                default:
                case 'harvesterLow':
                    myCreepCount.harvesterLowCount += 1;
                    break;
                case 'harvester':
                    myCreepCount.harvesterParts += creep_size;
                    myCreepCount.harvesterCount += 1;
                    break;
                case 'harvesterExtractor':
                    myCreepCount.harvesterExtractorParts += creep_size;
                    myCreepCount.harvesterExtractorCount += 1;
                    break;
                case 'upgrader':
                    myCreepCount.upgraderParts += creep_size;
                    myCreepCount.upgraderCount += 1;
                    break;
                case 'worker':
                    myCreepCount.workerParts += creep_size;
                    myCreepCount.workerCount += 1;
                    break;
                case 'mule':
                    myCreepCount.muleParts += creep.body.filter(part => part.type == CARRY).length;
                    myCreepCount.muleCount += 1;
                    break;
                case 'claimer':
                    myCreepCount.claimParts += creep.body.filter(part => part.type == CLAIM).length;
                    Memory.misc.globalCreepsTemp.claimer += 1;
                    break;
            }
        });

        Memory.stats['cpu.roomInit_temp'] += Game.cpu.getUsed() - SroomInit;
        // switch(creep.memory.role) {
        //     case 'worker':
        //         creep.memory.myTask = 'resupply';
        //         actResupply.run(creep);
        //         break;
        //     case 'mule':
        //         creep.memory.myTask = 'fetch';
        //         break;
        //     default:
        //         creep.memory.myTask = 'harvest';
        //         break;
        // }
        // break;
        myRoom.memory.myCreepCount = myCreepCount;

        Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] = 0;
        Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'] = 0;
        let rolesCpu = 0;

        let convert = null;
        myCreeps.forEach(creep => {
            let cpu = Game.cpu.getUsed();
            if (__WEBPACK_IMPORTED_MODULE_9__task_manager__["a" /* default */].run(creep, mySpawns)) {
                Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] += Game.cpu.getUsed() - cpu;
                rolesCpu = Game.cpu.getUsed();
                switch (creep.memory.role) {
                    case 'harvesterLow':
                    case 'harvester':
                        __WEBPACK_IMPORTED_MODULE_1__roles_role_harvester__["a" /* default */].run(creep);
                        break;
                    case 'harvesterExtractor':
                        __WEBPACK_IMPORTED_MODULE_1__roles_role_harvester__["a" /* default */].runExtractor(creep);
                        break;
                    case 'upgrader':
                        __WEBPACK_IMPORTED_MODULE_0__roles_role_upgrader__["a" /* default */].run(creep);
                        break;
                    case 'remoteWorker':
                    case 'worker':
                        if (myCreepCount.harvesterCount < 2) {
                            convert = creep;
                        }
                        __WEBPACK_IMPORTED_MODULE_3__roles_role_worker__["a" /* default */].run(creep);
                        break;
                    case 'mule':
                        __WEBPACK_IMPORTED_MODULE_2__roles_role_mule__["a" /* default */].run(creep);
                        break;
                    case 'reserve':
                        __WEBPACK_IMPORTED_MODULE_4__roles_role_claimer__["a" /* default */].reserve(creep);
                        break;
                    case 'claimer':
                        __WEBPACK_IMPORTED_MODULE_4__roles_role_claimer__["a" /* default */].run(creep);
                        break;
                    case 'thief':
                        __WEBPACK_IMPORTED_MODULE_5__roles_role_thief__["a" /* default */].run(creep);
                        break;
                    case 'thiefmule':
                        __WEBPACK_IMPORTED_MODULE_6__roles_role_thiefmule__["a" /* default */].run(creep);
                        break;
                    case 'melee':
                    case 'ranged':
                    case 'healer':
                    case 'blocker':
                    case 'tough':
                        break;
                }
                Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'] += Game.cpu.getUsed() - rolesCpu;
            } else {
                Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'] += Game.cpu.getUsed() - cpu;
            }
        });
        Memory.stats['room.' + myRoom.name + '.cpu.taskManager'] = Memory.stats['room.' + myRoom.name + '.cpu.taskManager_temp'];
        Memory.stats['room.' + myRoom.name + '.cpu.roles'] = Memory.stats['room.' + myRoom.name + '.cpu.roles_temp'];

        if (mySpawns && mySpawns.length > 0 && mySpawns[0].hits < mySpawns[0].hitsMax / 2 && myRoom.controller && !myRoom.controller.safeMode && !myRoom.controller.safeModeCooldown && myRoom.controller.safeModeAvailable) {
            myRoom.controller.activateSafeMode();
            // dont waste these!!
        }

        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);
        myRoom.memory.hasMules = myCreepCount.muleCount;

        const SroomUpdateConsts = Game.cpu.getUsed();
        updateRoomConsts(myRoom);
        Memory.stats['cpu.roomUpdateConsts_temp'] += Game.cpu.getUsed() - SroomUpdateConsts;

        const SrunTowers = Game.cpu.getUsed();
        runTowers(myTowers, myRoom);
        Memory.stats['cpu.runTowers_temp'] += Game.cpu.getUsed() - SrunTowers;

        const Slinks = Game.cpu.getUsed();
        transferLinks(myRoom.memory.links);
        Memory.stats['cpu.links_temp'] += Game.cpu.getUsed() - Slinks;

        Memory.stats['room.' + myRoom.name + '.cpu.spawner_temp'] = Game.cpu.getUsed();
        __WEBPACK_IMPORTED_MODULE_8__spawner__["a" /* default */].run(myRoom, mySpawns, myCreepCount, totalCreeps, convert);
        Memory.stats['room.' + myRoom.name + '.cpu.spawner'] = Game.cpu.getUsed() - Memory.stats['room.' + myRoom.name + '.cpu.spawner_temp'];
    }
};

function runTowers(myTowers, myRoom) {
    myTowers.forEach(tower => {
        var minRepair = 100000;
        if (!myRoom.memory.towers) {
            myRoom.memory.towers = {};
        }
        if (!myRoom.memory.towers[tower.id]) {
            myRoom.memory.towers[tower.id] = {};
        }
        if (myRoom.memory.towers[tower.id].attackCreep) {
            var target = Game.getObjectById(myRoom.memory.towers[tower.id].attackCreep);
            if (target && target.pos.roomName === myRoom.name) {
                var err = tower.attack(target);
                if (err == OK) {
                    return;
                }
            }
            myRoom.memory.towers[tower.id].attackCreep = 0;
        }
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile && tower.pos.getRangeTo(closestHostile) <= 30) {
            myRoom.memory.towers[tower.id].attackCreep = closestHostile.id;
            tower.attack(closestHostile);
        } else if (tower.energy > tower.energyCapacity / 2) {
            var repairTarget = 0;
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (creepToRepair != undefined) {
                tower.heal(creepToRepair);
                repairTarget = creepToRepair;
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER) && s.hits < s.hitsMax * 0.5
                });
                for (let structure of structureList) {
                    tower.repair(structure);
                    repairTarget = structure.id;
                    break;
                }
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, { filter: s => (s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL) && s.hits < minRepair
                });
                for (let structure of structureList) {
                    tower.repair(structure);
                    repairTarget = structure.id;
                    break;
                }
            }
        }
    });
}

function transferLinks(myLinks) {
    // Transer energy to empty links only. Leave 1 energy behind so links transferring dont count as empty
    if (myLinks) {
        var myLinksMapped = myLinks.map(link => Game.getObjectById(link));
        var receive = [];
        var give = [];
        myLinksMapped.forEach(link => {
            if (link) {
                if (link.energy > link.energyCapacity - 100) {
                    give.push(link);
                } else if (link.energy == 0) {
                    receive.push(link);
                }
            }
            // TODO DELETE DEAD LINKS
        });
        var condition = give.length > receive.length ? receive.length : give.length;
        for (var index = 0; index < condition; index += 1) {
            give[index].transferEnergy(receive[index], give[index].energy - 1);
        }
    }
}

function initializeRoomConsts(myRoom) {
    // TODO create the methods that scout adjacent rooms, which exit is better to steal from, etc
    myRoom.memory.timer = 0;
    myRoom.memory.structures = {};
    myRoom.memory.links = [];
    myRoom.memory.requests = [];
    myRoom.memory.marshalForce = false;
    myRoom.memory.runUpdate = false;
    myRoom.memory.spawnClaimer = 0;
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if (Memory.methods.createRemoteWorkers) {
        Memory.methods.createRemoteWorkers -= 1;
        myRoom.memory.requests.push({
            'role': 'worker',
            'myTask': 'goToTarget',
            'goToTarget': 'W46N52'
        });
    }
    if (myRoom.memory.timer % 300 == 0 || myRoom.memory.runUpdate) {
        // TODO REMVOE THIS MECHANIC
        // TODO this isnt triggering. hardcode trigger in spawn? WHY DOESNT THIS SET
        myRoom.memory.energyRation = 5000;
        myRoom.memory.structures = {};
    }
    if (myRoom.memory.timer % 1000 == 0 || myRoom.memory.runUpdate) {
        myRoom.memory.runUpdate = false;
        var container = myRoom.find(FIND_STRUCTURES, {
            'filter': structure => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });

        var storage = myRoom.find(FIND_STRUCTURES, {
            'filter': structure => {
                return structure.structureType == STRUCTURE_STORAGE;
            }
        });

        var links = myRoom.find(FIND_STRUCTURES, {
            'filter': structure => {
                return structure.structureType == STRUCTURE_LINK;
            }
        });

        var extractor = myRoom.find(FIND_STRUCTURES, {
            'filter': structure => {
                return structure.structureType == STRUCTURE_EXTRACTOR;
            }
        });

        myRoom.memory.links = links.map(link => link.id);

        myRoom.memory.hasStorage = storage.length > 0;
        myRoom.memory.hasContainers = container.length > 0;
        myRoom.memory.hasLinks = links.length > 1;
        myRoom.memory.hasExtractor = extractor.length > 0;

        // This function will update stuff like functional roads, etc. Runs every 1K ticks, will have to break this up or store the paths. commented out because I am not using it
        // myRoom.find(FIND_SOURCES).forEach(Source => {
        //     mySpawns.forEach(Spawn => {
        //         findPath(Source.pos, Spawn.pos, {ignoreCreeps: true,}).forEach(pathStep => {
        //             lookForAt(LOOK_STRUCTURES, pathStep.x, pathStep.y).forEach(structure => {
        //                 if (structure.structureType != STRUCTURE_ROAD) {
        //                     myRoom.memory.roadsPresent = false;
        //                     return false;
        //                 }
        //             });
        //         });
        //     });
        // });
        // myRoom.memory.roadsPresent = true;
        // return true;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (RoomController);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleUpgrader = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (!(creep.memory.myTask == 'upgrade') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrade';
        }
        if (creep.carry.energy == 0) {
            creep.memory.myTask = 'resupply';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleUpgrader);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_action_harvest__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_deposit__ = __webpack_require__(5);



const roleHarvester = {
    run: function (creep) {
        // TODO FIX THIS BS OR ASSUME YOU WILL ALWAYS BE CALLED AFTER
        if (creep.memory.home && creep.memory.home != creep.room.name) {
            // This fixes harvester who path out of the room
            creep.memory.myTask = "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (creep.memory.moveToTargetx) {
            creep.memory.myTask = "moveToTarget";
        } else if (!creep.carryCapacity || creep.carry.energy < creep.carryCapacity) {
            creep.memory.myTask = 'harvest';
            __WEBPACK_IMPORTED_MODULE_0__actions_action_harvest__["a" /* default */].run(creep);
        } else if (creep.carryCapacity == creep.carry.energy) {
            creep.memory.myTask = 'deposit';
            __WEBPACK_IMPORTED_MODULE_1__actions_action_deposit__["a" /* default */].run(creep, false);
        }
    },
    runExtractor: function (creep) {
        if (creep.memory.home && creep.memory.home != creep.room.name) {
            // This fixes harvester who path out of the room
            creep.memory.myTask = "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (creep.memory.moveToTargetx) {
            creep.memory.myTask = "moveToTarget";
        } else if (!creep.carryCapacity || _.sum(creep.carry) < creep.carryCapacity) {
            creep.memory.myTask = 'harvestMinerals';
        } else if (creep.carryCapacity == _.sum(creep.carry)) {
            creep.memory.myTask = 'deposit';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleHarvester);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleMule = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }
        if (creep.memory.home && creep.memory.home != creep.room.name) {
            creep.memory.myTask = "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (_.sum(creep.carry) < creep.carryCapacity * 0.75) {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
        } else if (_.sum(creep.carry) >= creep.carryCapacity * 0.75) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleMule);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleWorker = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (creep.memory.home && creep.memory.home != creep.room.name) {
            creep.memory.myTask = "goToTarget";
            creep.memory.goToTarget = creep.memory.home;
        } else if (creep.memory.myTask != 'resupply') {
            if (creep.carry.energy == 0) {
                creep.memory.myTask = 'resupply';
            } else if (creep.memory.myBuildTarget) {
                creep.memory.myTask = 'resupply';
            } else {
                creep.memory.myTask = 'upgrade';
            }
        } else {
            if (creep.carry.energy == creep.carryCapacity) {
                if (creep.room.controller.ticksToDowngrade < 2200) {
                    creep.memory.myTask = 'upgrade';
                } else {
                    creep.memory.myTask = 'build';
                }
            } else {
                creep.memory.myTask = 'moveToTarget';
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleWorker);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleClaimer = {
    run: function (creep) {
        if (creep.fatigue != 0) {
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
    },
    reserve: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }
        if (creep.room.name != creep.memory.reserveTarget) {
            creep.memory.goToTarget = creep.memory.reserveTarget;
            creep.memory.myTask = 'goToTarget';
        } else {
            creep.memory.myTask = 'reserve';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleClaimer);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__roles_role_thief__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__roles_role_thiefmule__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__spawnType__ = __webpack_require__(19);




const spawner = {
    run: function (myRoom, mySpawns, myCreepCount, totalCreeps, convert) {
        var MaxParts = {
            'harvester': 6, // definitely
            'harvesterExtractor': 6,
            'worker': 10,
            'mule': 12,
            'upgrader': 6,
            'thief': 3, //halved for non reserved rez
            'melee': 70,
            'ranged': 70,
            'healer': 10,
            'blocker': 2, //not used current
            'tough': 1
        };
        const MaxHarvesterCount = myRoom.memory.hasLinks || myRoom.memory.hasContainers ? 2 : 4;
        const MaxHarvesterExtractorCount = myRoom.memory.hasContainers && myRoom.memory.hasExtractor ? 0 : 0; //1 : 0;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        let MaxWorkerCount = 2;
        if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] > 800000) {
            MaxWorkerCount = 4;
        } else if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] > 500000) {
            MaxWorkerCount = 3;
        } else if (myRoom.storage && myRoom.storage.store[RESOURCE_ENERGY] < 100000) {
            MaxWorkerCount = 1;
        } else if (!myRoom.storage) {
            MaxWorkerCount = 10; // while getting started
        }

        let MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasExtractor ? 2 : MaxMuleCount;

        let canSpawn = true;

        let sourceMapNumber = 99;
        let sourceMap = 0;

        mySpawns.forEach(Spawn => {
            if (Spawn && Spawn.spawning) {
                switch (Game.creeps[Spawn.spawning.name].memory.role) {
                    case 'claimer':
                        Memory.misc.globalCreepsTemp.claimer += 1;
                        break;
                    case 'harvester':
                        myCreepCount.harvesterCount += 1;
                        myCreepCount.sourceMap[Game.creeps[Spawn.spawning.name].memory.sourceMap] = 1 + (myCreepCount.sourceMap[Game.creeps[Spawn.spawning.name].memory.sourceMap] || 0);
                        break;
                    case 'worker':
                        myCreepCount.workerCount += 1;
                        break;
                    case 'harvesterExtractor':
                        myCreepCount.harvesterExtractorCount += 1;
                        break;
                    case 'mule':
                        myCreepCount.muleCount += 1;
                        break;
                }
            }
        });

        myRoom.memory.sources.forEach(source => {
            if ((myCreepCount.sourceMap[source] || 0) < sourceMapNumber) {
                sourceMapNumber = myCreepCount.sourceMap[source] || 0;
                sourceMap = source;
            }
        });

        mySpawns.forEach(Spawn => {
            const totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
            const referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
            if (Spawn && !Spawn.spawning && canSpawn) {
                if (Spawn.memory.renewTarget) {
                    canSpawn = false;
                    var target = Game.getObjectById(Spawn.memory.renewTarget);
                    if (target) {
                        var err = Spawn.renewCreep(target);
                        if (err == ERR_FULL || err == ERR_INVALID_TARGET) {
                            delete Spawn.memory.renewTarget;
                        } else if (err == ERR_NOT_IN_RANGE) {
                            // Do something else while we wait for him to get close
                            canSpawn = true;
                            delete Spawn.memory.renewTarget;
                        }
                    } else {
                        delete Spawn.memory.renewTarget;
                    }
                }
                if (myCreepCount.harvesterParts < MaxParts.harvester * MaxHarvesterCount && myCreepCount.harvesterCount < MaxHarvesterCount && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 1200) && canSpawn) {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.harvester, { 'harvester': true }), newName, {
                        memory: {
                            'role': 'harvester',
                            'myTask': 'harvest',
                            'home': myRoom.name,
                            'sourceMap': sourceMap
                        }
                    });
                    myCreepCount.sourceMap[sourceMap] += 1;
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.harvesterCount < 1 && myCreepCount.harvesterLowCount < 1 && canSpawn && myRoom.energyAvailable >= 200) //just in case, if there are no harvesters spawn a harvester
                    {
                        var newName = 'HarvesterLow' + Game.time;
                        Spawn.spawnCreep(getBody(myRoom, Math.floor(myRoom.energyAvailable / 200), { 'harvester': true }), newName, {
                            memory: {
                                'role': 'harvesterLow',
                                'myTask': 'harvest',
                                'home': myRoom.name,
                                'tempSourceMap': sourceMap
                            }
                        });
                        console.log('Spawning: ' + newName);
                        canSpawn = false;
                    }
                // to kickstart a claimer, set room.memory.spawnClaimer and the target ID as room.memory.claimTarget
                if (myRoom.memory.spawnClaimer > 0 && myRoom.energyAvailable >= 700 && canSpawn) {
                    var newName = 'Claimer' + Game.time;
                    Spawn.spawnCreep([CLAIM, MOVE, MOVE], newName, {
                        memory: {
                            'role': 'claimer',
                            'myTask': null //generate a target from the claimer role
                        }
                    });
                    console.log('Spawning: ' + newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if (myCreepCount.workerParts < MaxParts.worker * MaxWorkerCount && myCreepCount.workerCount < MaxWorkerCount && myCreepCount.muleCount >= MaxMuleCount / 2 && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 2000) && canSpawn) {
                    var newName = 'Worker' + Game.time;
                    const err = Spawn.spawnCreep(__WEBPACK_IMPORTED_MODULE_2__spawnType__["a" /* default */].worker(myRoom), newName, {
                        memory: {
                            'role': 'worker',
                            'home': myRoom.name,
                            'myTask': 'resupply'
                        }
                    });
                    if (err != OK) {
                        console.log(__WEBPACK_IMPORTED_MODULE_2__spawnType__["a" /* default */].worker(myRoom));
                        console.log(myRoom.name);
                    }
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (convert && myCreepCount.harvesterCount < 2 && canSpawn && myRoom.energyAvailable <= referenceEnergy * 0.75) {
                    convert.memory.role = 'harvester';
                    convert.memory.sourceMap = sourceMap;
                    canSpawn = false;
                }
                if (myCreepCount.muleParts < MaxParts.mule * MaxMuleCount && myCreepCount.muleCount < MaxMuleCount && (myRoom.energyAvailable >= referenceEnergy || myRoom.energyAvailable >= 1500) && canSpawn) {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, { 'mule': true }), newName, {
                        memory: {
                            'role': 'mule',
                            'home': myRoom.name,
                            'myTask': 'fetch'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.harvesterExtractorParts < MaxParts.harvesterExtractor * MaxHarvesterExtractorCount && myCreepCount.harvesterExtractorCount < MaxHarvesterExtractorCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'HarvesterExtractor' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.harvesterExtractor, { 'harvester': true }), newName, {
                        memory: {
                            'role': 'harvesterExtractor',
                            'home': myRoom.name,
                            'myTask': 'harvestMinerals'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    canSpawn = !completeOutstandingRequests(myRoom, Spawn);
                }
            }
        });
    }
};

function completeOutstandingRequests(myRoom, Spawn) {
    if (myRoom.memory.requests && myRoom.memory.requests.length) {
        var newName = myRoom.memory.requests[0].name || myRoom.memory.requests[0].role + Game.time + Spawn.name;
        const options = {};
        options[myRoom.memory.requests[0].secondaryRole || myRoom.memory.requests[0].role] = true;
        if (myRoom.memory.requests[0].sourceMap) {
            options['sourceMap'] = myRoom.memory.requests[0].sourceMap;
        }
        const suggestedBody = getBody(myRoom, 50, options);
        const err = Spawn.spawnCreep(suggestedBody, newName, {
            memory: myRoom.memory.requests[0]
        });
        if (err == OK) {
            // TODO if we have a squad but cant find the id, create a retired squad
            if (myRoom.memory.requests[0].squad && Memory.squads[myRoom.memory.requests[0].squad]) {
                Memory.squads[myRoom.memory.requests[0].squad].creeps.push(newName);
            }
            const buildno = Memory.buildQueue.indexOf(newName);
            if (buildno != -1) {
                Memory.buildQueue.splice(buildno, 1);
            }
            myRoom.memory.requests.splice(0, 1);
            console.log('Spawning: ' + newName);
            return true;
        } else if (err == ERR_NAME_EXISTS) {
            const buildno = Memory.buildQueue.indexOf(newName);
            if (buildno != -1) {
                Memory.buildQueue.splice(buildno, 1);
            }
            myRoom.memory.requests.splice(0, 1);
            console.log('Same name, removing queue: ' + newName);
            return false;
        } else {
            console.log(err);
            console.log(suggestedBody.length);
            console.log(newName);
            console.log(JSON.stringify({ memory: myRoom.memory.requests[0] }));
            console.log("brains failed to spawn");
            return false;
        }
    }
}

function getBody(myRoom, MaxParts, options = {}) {
    var totalEnergy = Math.floor(myRoom.energyAvailable / 50);
    var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
    var partArray = [];

    if (options.blocker) {
        partArray.push(TOUGH);
        partArray.push(MOVE);
        return partArray;
    }
    if (options.tough) {
        for (var i = 0; i < Math.floor((referenceEnergy - 130) / 70) && i < MaxParts - 1; i += 1) {
            partArray.push(TOUGH);
            partArray.push(TOUGH);
            partArray.push(MOVE);
        }
        partArray.push(MOVE);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.reserve) {
        partArray.push(MOVE);
        partArray.push(MOVE);
        partArray.push(CLAIM);
        partArray.push(CLAIM);
        return partArray;
    }
    if (options.defcon) {
        for (var i = 0; i < Math.floor((referenceEnergy - 400) / 50) && i < 20; i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.grinder) {
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        for (var i = 0; i < Math.floor((referenceEnergy - 1040) / 50) && i < 41; i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(MOVE);
        return partArray;
    }
    if (options.guard) {
        for (var i = 0; i < Math.floor((referenceEnergy - 640) / 80) && i < 21; i += 1) {
            partArray.push(TOUGH);
            partArray.push(MOVE);
        }
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.farm) {
        for (var i = 0; i < Math.floor((referenceEnergy - 2170) / 50) && i < 25; i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(TOUGH);
        partArray.push(TOUGH);
        partArray.push(RANGED_ATTACK);
        partArray.push(RANGED_ATTACK);
        partArray.push(RANGED_ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        partArray.push(ATTACK);
        return partArray;
    }
    if (options.melee) {
        for (var i = 0; totalEnergy >= 3 && i < MaxParts; i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
            totalEnergy -= 3;
        }
        return partArray;
    }
    if (options.heal) {
        for (var i = 0; i < Math.floor((referenceEnergy - 3750) / 50) && i < 35; i += 1) {
            partArray.push(MOVE);
        }
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        partArray.push(HEAL);
        return partArray;
    }
    if (options.ranged) {
        for (var i = 0; totalEnergy >= 4 && i < MaxParts; i += 1) {
            partArray.push(RANGED_ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    let workCount = 0;
    if (options.harvester && myRoom.memory.hasMules && myRoom.memory.hasContainers) {
        totalEnergy -= 1;
        partArray.push(CARRY);
        while (totalEnergy >= 3 && workCount < MaxParts && workCount < Math.floor(referenceEnergy / 200)) {
            partArray.push(WORK);
            partArray.push(MOVE);
            totalEnergy -= 3;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts && workCount < Math.floor(referenceEnergy / 200)) {
                partArray.push(WORK);
                partArray.push(WORK);
                workCount += 2;
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    if (options.thief) {
        let amount = 3;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && (Memory.energyMap[options.sourceMap] > 1500 || Memory.reservers[Memory.roomMap[options.sourceMap]])) {
            amount = 6;
            if (Memory.energyMap[options.sourceMap] > 3000) {
                amount = 8;
            }
        }
        partArray.push(CARRY);
        totalEnergy -= 1;
        while (totalEnergy >= 3 && workCount < amount) {
            partArray.push(WORK);
            partArray.push(MOVE);
            totalEnergy -= 3;
            workCount += 1;
        }
        return partArray;
    }
    if (options.harvester) {
        while (totalEnergy >= 4 && workCount < 6 && workCount < Math.floor(referenceEnergy / 200)) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
        }
        return partArray;
    }
    if (options.worker) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount += 1;
        while (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy / 200)) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy / 200)) {
                partArray.push(WORK);
                totalEnergy -= 2;
                workCount += 1;
            }
        }
        return partArray;
    }
    if (options.remoteWorker) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 5;
        workCount += 1;
        while (totalEnergy >= 5 && workCount < 16 && workCount < Math.floor(referenceEnergy / 250)) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 5;
            workCount += 1;
        }
        return partArray;
    }
    if (options.mule || options.thiefmule) {
        let amount = 6;
        if (options.thiefmule) {
            amount = 6;
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            if (options.sourceMap && Memory.energyMap[options.sourceMap] && (Memory.energyMap[options.sourceMap] > 3000 || Memory.reservers[Memory.roomMap[options.sourceMap]])) {
                amount = 15;
            }
        }
        while (totalEnergy >= 4 && workCount < amount) {
            partArray.push(MOVE);
            partArray.push(CARRY);
            partArray.push(CARRY);
            totalEnergy -= 3;
            workCount += 1;
        }
        return partArray;
    }
    while (totalEnergy >= 4 && workCount < 12) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        partArray.push(CARRY);
        totalEnergy -= 5;
        workCount += 1;
    }
    return partArray;
}

/* harmony default export */ __webpack_exports__["a"] = (spawner);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__roles_role_thief__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__roles_role_thiefmule__ = __webpack_require__(4);



const spawnType = {
    defcon(myRoom) {
        return processBody(myRoom, [[MOVE], 'M', 1, 25], [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S']);
    },
    grinder(myRoom) {
        return processBody(myRoom, [[ATTACK, ATTACK, ATTACK], 'S'][([MOVE], 'M', 0.6, 0)], [[HEAL], 'M', 0.4, 0], [[MOVE], 'S']);
    },
    guard(myRoom) {
        return processBody(myRoom, [[MOVE], 'M', 0.4, 17], [[RANGED_ATTACK], 'M', 0.2, 3], [[ATTACK], 'M', 0.4, 10]);
    },
    farm(myRoom) {
        return processBody(myRoom, [[MOVE], 'M', 1, 25], [[TOUGH, TOUGH], 'S'], [[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'S'], [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S']);
    },
    heal(myRoom) {
        return processBody(myRoom, [[MOVE], 'M', 1, 20], [[HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'S']);
    },
    thief(myRoom, options) {
        let amount = 3;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && (Memory.energyMap[options.sourceMap] > 1500 || Memory.reservers[Memory.roomMap[options.sourceMap]])) {
            amount = 6;
            if (Memory.energyMap[options.sourceMap] > 3000) {
                amount = 8;
            }
        }
        return processBody(myRoom, [[CARRY], 'S'], [[MOVE], 'M', 1, 5], [[WORK], 'M', 1, amount]);
    },
    harvester(myRoom) {
        if (myRoom.memory.hasMules && myRoom.memory.hasContainers) {
            return processBody(myRoom, [[CARRY], 'S'], [[MOVE], 'M', 0.25, 4], [[WORK], 'M', 0.75, 6]);
        } else {
            return processBody(myRoom, [[CARRY], 'M', 0.25, 4], [[MOVE], 'M', 0.25, 8], [[WORK], 'M', 0.5, 6]);
        }
    },
    worker(myRoom) {
        return processBody(myRoom, [[CARRY], 'M', 0.25, 5], [[MOVE], 'M', 0.25, 10], [[WORK], 'M', 0.5, 15]);
    },
    claim(myRoom) {
        return processBody(myRoom, [[CLAIM, MOVE, MOVE], 'S']);
    },
    reserve(myRoom) {
        return processBody(myRoom, [[CLAIM, CLAIM, MOVE, MOVE], 'S']);
    },
    remoteWorker(myRoom) {
        return processBody(myRoom, [[CARRY], 'M', 0.25, 15], [[MOVE], 'M', 0.5, 30], [[WORK], 'M', 0.25, 15]);
    },
    mule(myRoom) {
        return processBody(myRoom, [[CARRY, MOVE, CARRY], 'M', 1, 6]);
    },
    thiefmule(myRoom, options) {
        let amount = 6;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && (Memory.energyMap[options.sourceMap] > 3000 || Memory.reservers[Memory.roomMap[options.sourceMap]])) {
            amount = 15;
        }
        return processBody(myRoom, [[WORK, MOVE, CARRY], 'S'], [[CARRY, MOVE, CARRY], 'M', 1, amount]);
    }
};

/*
takes all args
each one is an array
[command, parts(array), command arg1, command arg2]

commands: 
S: single mandatory (no more than 300)
M: multiple, implied optional
(arg1 is a PERCENTAGE between 0 and 1 of the ENERGY leftover after single options)
(arg2 is the MAXIMUM number of iterations)


if over 300, returns first 300 worth of commands.
*/

function processBody(myRoom, ...commands) {
    let finalBuild = commands.map(() => ({
        cost: 0,
        parts: []
    }));
    // SM
    let totalCost = 0;
    let multiplier = 0;
    commands.forEach((command, index) => {
        if (command[1] === 'S') {
            let cost = 0;
            command[0].forEach(part => {
                cost += BODYPART_COST[part];
            });
            // if cost over 300, truncate
            totalCost += cost;
            finalBuild[index].cost = cost;
            finalBuild[index].parts = command[1];
        } else if (command[1] === 'M') {
            multiplier += command[2];
        }
    });

    const totalAvailable = myRoom.energyAvailable - totalCost;

    // MM
    let proportionBonus = 0;
    commands.forEach((command, index) => {
        if (command[1] === 'M') {
            let commandCost = 0;
            command[0].forEach(part => {
                commandCost += BODYPART_COST[part];
            });
            const proportion = command[2];
            const commandMaxCost = totalAvailable * proportion + proportionBonus;
            let numberOfCommands;
            if (command[3]) {
                const maxParts = Math.floor(commandMaxCost / commandCost);
                if (maxParts > command[3]) {
                    numberOfCommands = command[3];
                } else {
                    numberOfCommands = maxParts;
                }
            } else {
                numberOfCommands = Math.floor(commandMaxCost / commandCost);
            }
            const commandFinalCost = numberOfCommands * commandCost;
            totalCost += commandFinalCost;
            proportionBonus = commandMaxCost - commandFinalCost;
            finalBuild[index].cost = commandFinalCost;
            let finalArray = [];
            for (var i = 0; i < numberOfCommands; i += 1) {
                finalArray = finalArray.concat(command[0]);
            }
            finalBuild[index].parts = finalArray;
        }
    });

    // Build final return
    let result = [];
    finalBuild.forEach(buildOrder => {
        result = result.concat(buildOrder.parts);
    });
    if (result.length < 3) {
        console.log("Less than 3 parts returned from build constructor. Build when you have more energy");
        return [];
    }
    return result;
}

/* harmony default export */ __webpack_exports__["a"] = (spawnType);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_action_deposit__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_resupply__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_action_harvest__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_action_upgrade__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_action_build__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util__ = __webpack_require__(0);










/**
* Runs the current state and returns the state machine results. A return of true means we need to assign a new task.
*/

const taskManager = {
    run: function (creep, mySpawns) {
        switch (creep.memory.preTask) {
            case 'roadWorker':
                if (__WEBPACK_IMPORTED_MODULE_5__actions_action_build__["a" /* default */].roadWorks(creep)) {
                    return false;
                }
                break;
        }
        switch (creep.memory.myTask) {
            case 'claim':
                return __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__["a" /* default */].run(creep);
            case 'reserve':
                return __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__["a" /* default */].reserve(creep);
            case 'fetch':
                return __WEBPACK_IMPORTED_MODULE_1__actions_action_resupply__["a" /* default */].getEnergy(creep);
            case 'deposit':
                return __WEBPACK_IMPORTED_MODULE_0__actions_action_deposit__["a" /* default */].run(creep, creep.memory.role == 'mule' || creep.memory.role == 'thiefmule');
            case 'lazydeposit':
                return __WEBPACK_IMPORTED_MODULE_0__actions_action_deposit__["a" /* default */].lazydeposit(creep);
            case 'harvest':
                return __WEBPACK_IMPORTED_MODULE_3__actions_action_harvest__["a" /* default */].run(creep);
            case 'harvestMinerals':
                return __WEBPACK_IMPORTED_MODULE_3__actions_action_harvest__["a" /* default */].runMinerals(creep);
            case 'moveToTarget':
                return __WEBPACK_IMPORTED_MODULE_7__util__["a" /* default */].moveToTarget(creep);
            case 'moveToObject':
                return __WEBPACK_IMPORTED_MODULE_7__util__["a" /* default */].moveToObject(creep);
            case 'goToTarget':
                return __WEBPACK_IMPORTED_MODULE_7__util__["a" /* default */].goToTarget(creep);
            case 'loiter':
                return __WEBPACK_IMPORTED_MODULE_7__util__["a" /* default */].loiter(creep);
            case 'upgrade':
                return __WEBPACK_IMPORTED_MODULE_4__actions_action_upgrade__["a" /* default */].run(creep);
            case 'resupply':
                return __WEBPACK_IMPORTED_MODULE_1__actions_action_resupply__["a" /* default */].run(creep);
            case 'repair':
            case 'build':
                return __WEBPACK_IMPORTED_MODULE_5__actions_action_build__["a" /* default */].run(creep);
            case 'heal':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].heal(creep);
            case 'dualAttack':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].dualAttack(creep);
            case 'attack':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].attack(creep);
            case 'rangedAttack':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].rangedAttack(creep);
            case 'block':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].block(creep);
            case 'gather':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].gather(creep);
            case 'renew':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].renew(creep, mySpawns);
            default:
                console.log(creep.name);
                console.log(creep.memory.role);
                console.log('State machine failed, investigate');
                return true;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (taskManager);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(1);


const actResupply = {
    run: function (creep) {
        //find the closest containr or storage that has enough energy to fill me
        //it's been a while since I looked into this, jeeze this eats up a lot of CPU, this should check once then head towards it
        //TODO: make this not suck CPU, save the target etc.
        if (_.sum(creep.carry) == creep.carryCapacity) {
            delete creep.memory.resupplyTarget;
            return true;
        }
        if (!creep.memory.resupplyTarget) {
            getResupplyTarget(creep);
        }
        if (creep.memory.resupplyTarget) {
            var resupplyTarget = Game.getObjectById(creep.memory.resupplyTarget);
            var err = resupplyTarget && creep.withdraw(resupplyTarget, RESOURCE_ENERGY);
            if (err == OK) {
                delete creep.memory.resupplyTarget;
                if (_.sum(creep.carry) == creep.carryCapacity) {
                    return true;
                }
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(resupplyTarget.pos);
            } else {
                getResupplyTarget(creep);
            }
        } else {
            return __WEBPACK_IMPORTED_MODULE_0__action_harvest__["a" /* default */].run(creep);
        }
    },
    getEnergy: function (creep) {
        if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
            getTargets(creep);
        }
        if (_.sum(creep.carry) >= creep.carryCapacity * 0.75) {
            delete creep.memory.dropTarget;
            delete creep.memory.fetchTarget;
            return true;
        }
        var target;
        if (creep.memory.dropTarget) {
            target = Game.getObjectById(creep.memory.dropTarget);
            var err = target && creep.pickup(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(target.pos);
            } else if (err == OK) {
                delete creep.memory.dropTarget;
            } else {
                getTargets(creep);
            }
        } else if (creep.memory.fetchTarget) {
            target = Game.getObjectById(creep.memory.fetchTarget);
            var err = target && creep.withdraw(target, RESOURCE_ENERGY);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveToCacheTarget(target.pos);
            } else if (err == OK) {
                creep.memory.fetchTarget = 0;
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                var resources = Object.keys(target.store);
                // first one is usually energy due to alphbetical order TODO fix this to be error free
                err = creep.withdraw(target, resources[1]);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveToCacheTarget(target.pos);
                } else if (err == OK) {
                    delete creep.memory.fetchTarget;
                } else {
                    getTargets(creep);
                }
            } else {
                getTargets(creep);
            }
        }
        if (!target) {
            return true;
        }
    }
};

function getTargets(creep) {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: resources => {
            return creep.carryCapacity / 2 < resources.amount;
        }
    });
    if (target) {
        creep.memory.dropTarget = target.id;
        delete creep.memory.fetchTarget;
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy >= creep.carryCapacity / 2;
            }
        });
        if (target) {
            creep.memory.fetchTarget = target.id;
            delete creep.memory.dropTarget;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store.energy >= creep.carryCapacity / 2;
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
                delete creep.memory.dropTarget;
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TERMINAL) && structure.store.energy > 0;
                    }
                });
                if (target) {
                    creep.memory.fetchTarget = target.id;
                    delete creep.memory.dropTarget;
                }
            }
        }
    }
}

function getResupplyTarget(creep) {
    var target = creep.pos.findInRange(FIND_STRUCTURES, 5, {
        filter: structure => {
            return structure.structureType == STRUCTURE_LINK && structure.energy > 0;
        }
    });
    if (target.length > 0) {
        target = target[0];
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TERMINAL) && structure.storeCapacity && structure.store.energy >= creep.carryCapacity;
            }
        });
    }
    if (target) {
        creep.memory.resupplyTarget = target.id;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actResupply);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var actUpgrade = {
    run: function (creep) {
        if (creep.memory.MyController == undefined) {
            creep.memory.MyController = creep.room.controller && creep.room.controller.id;
        }
        if (creep.carry.energy == 0) {
            // expect state to return to fetch/resupply
            return true;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if (creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveToCacheTarget(myUpgrade.pos);
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actUpgrade);

/***/ })
/******/ ]);