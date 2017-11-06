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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
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
        } else if (creep.room.name == creep.memory.goToTarget) {
            delete creep.memory.goToTarget;
            delete creep.memory.myTask;
        } else {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget)));
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (util);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let usedOnStart = 0;
let enabled = false;
let depth = 0;

function AlreadyWrappedError() {
  this.name = 'AlreadyWrappedError';
  this.message = 'Error attempted to double wrap a function.';
  this.stack = new Error().stack;
}

function setupProfiler() {
  depth = 0; // reset depth, this needs to be done each tick.
  Game.profiler = {
    stream(duration, filter) {
      setupMemory('stream', duration || 10, filter);
    },
    email(duration, filter) {
      setupMemory('email', duration || 100, filter);
    },
    profile(duration, filter) {
      setupMemory('profile', duration || 100, filter);
    },
    background(filter) {
      setupMemory('background', false, filter);
    },
    restart() {
      if (Profiler.isProfiling()) {
        const filter = Memory.profiler.filter;
        let duration = false;
        if (!!Memory.profiler.disableTick) {
          // Calculate the original duration, profile is enabled on the tick after the first call,
          // so add 1.
          duration = Memory.profiler.disableTick - Memory.profiler.enabledTick + 1;
        }
        const type = Memory.profiler.type;
        setupMemory(type, duration, filter);
      }
    },
    reset: resetMemory,
    output: Profiler.output
  };

  overloadCPUCalc();
}

function setupMemory(profileType, duration, filter) {
  resetMemory();
  const disableTick = Number.isInteger(duration) ? Game.time + duration : false;
  if (!Memory.profiler) {
    Memory.profiler = {
      map: {},
      totalTime: 0,
      enabledTick: Game.time + 1,
      disableTick,
      type: profileType,
      filter
    };
  }
}

function resetMemory() {
  Memory.profiler = null;
}

function overloadCPUCalc() {
  if (Game.rooms.sim) {
    usedOnStart = 0; // This needs to be reset, but only in the sim.
    Game.cpu.getUsed = function getUsed() {
      return performance.now() - usedOnStart;
    };
  }
}

function getFilter() {
  return Memory.profiler.filter;
}

const functionBlackList = ['getUsed', // Let's avoid wrapping this... may lead to recursion issues and should be inexpensive.
'constructor'];

function wrapFunction(name, originalFunction) {
  if (originalFunction.profilerWrapped) {
    throw new AlreadyWrappedError();
  }
  function wrappedFunction() {
    if (Profiler.isProfiling()) {
      const nameMatchesFilter = name === getFilter();
      const start = Game.cpu.getUsed();
      if (nameMatchesFilter) {
        depth++;
      }
      const result = originalFunction.apply(this, arguments);
      if (depth > 0 || !getFilter()) {
        const end = Game.cpu.getUsed();
        Profiler.record(name, end - start);
      }
      if (nameMatchesFilter) {
        depth--;
      }
      return result;
    }

    return originalFunction.apply(this, arguments);
  }

  wrappedFunction.profilerWrapped = true;
  wrappedFunction.toString = () => `// screeps-profiler wrapped function:\n${originalFunction.toString()}`;

  return wrappedFunction;
}

function hookUpPrototypes() {
  Profiler.prototypes.forEach(proto => {
    profileObjectFunctions(proto.val, proto.name);
  });
}

function profileObjectFunctions(object, label) {
  const objectToWrap = object.prototype ? object.prototype : object;

  Object.getOwnPropertyNames(objectToWrap).forEach(functionName => {
    const extendedLabel = `${label}.${functionName}`;

    const isBlackListed = functionBlackList.indexOf(functionName) !== -1;
    if (isBlackListed) {
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(objectToWrap, functionName);
    if (!descriptor) {
      return;
    }

    const hasAccessor = descriptor.get || descriptor.set;
    if (hasAccessor) {
      const configurable = descriptor.configurable;
      if (!configurable) {
        return;
      }

      const profileDescriptor = {};

      if (descriptor.get) {
        const extendedLabelGet = `${extendedLabel}:get`;
        profileDescriptor.get = profileFunction(descriptor.get, extendedLabelGet);
      }

      if (descriptor.set) {
        const extendedLabelSet = `${extendedLabel}:set`;
        profileDescriptor.set = profileFunction(descriptor.set, extendedLabelSet);
      }

      Object.defineProperty(objectToWrap, functionName, profileDescriptor);
      return;
    }

    const isFunction = typeof descriptor.value === 'function';
    if (!isFunction) {
      return;
    }
    const originalFunction = objectToWrap[functionName];
    objectToWrap[functionName] = profileFunction(originalFunction, extendedLabel);
  });

  return objectToWrap;
}

function profileFunction(fn, functionName) {
  const fnName = functionName || fn.name;
  if (!fnName) {
    console.log('Couldn\'t find a function name for - ', fn);
    console.log('Will not profile this function.');
    return fn;
  }

  return wrapFunction(fnName, fn);
}

const Profiler = {
  printProfile() {
    console.log(Profiler.output());
  },

  emailProfile() {
    Game.notify(Profiler.output(1000));
  },

  output(passedOutputLengthLimit) {
    const outputLengthLimit = passedOutputLengthLimit || 1000;
    if (!Memory.profiler || !Memory.profiler.enabledTick) {
      return 'Profiler not active.';
    }

    const endTick = Math.min(Memory.profiler.disableTick || Game.time, Game.time);
    const startTick = Memory.profiler.enabledTick + 1;
    const elapsedTicks = endTick - startTick;
    const header = 'calls\t\ttime\t\tavg\t\tfunction';
    const footer = [`Avg: ${(Memory.profiler.totalTime / elapsedTicks).toFixed(2)}`, `Total: ${Memory.profiler.totalTime.toFixed(2)}`, `Ticks: ${elapsedTicks}`].join('\t');

    const lines = [header];
    let currentLength = header.length + 1 + footer.length;
    const allLines = Profiler.lines();
    let done = false;
    while (!done && allLines.length) {
      const line = allLines.shift();
      // each line added adds the line length plus a new line character.
      if (currentLength + line.length + 1 < outputLengthLimit) {
        lines.push(line);
        currentLength += line.length + 1;
      } else {
        done = true;
      }
    }
    lines.push(footer);
    return lines.join('\n');
  },

  lines() {
    const stats = Object.keys(Memory.profiler.map).map(functionName => {
      const functionCalls = Memory.profiler.map[functionName];
      return {
        name: functionName,
        calls: functionCalls.calls,
        totalTime: functionCalls.time,
        averageTime: functionCalls.time / functionCalls.calls
      };
    }).sort((val1, val2) => {
      return val2.totalTime - val1.totalTime;
    });

    const lines = stats.map(data => {
      return [data.calls, data.totalTime.toFixed(1), data.averageTime.toFixed(3), data.name].join('\t\t');
    });

    return lines;
  },

  prototypes: [{ name: 'Game', val: Game }, { name: 'Room', val: Room }, { name: 'Structure', val: Structure }, { name: 'Spawn', val: Spawn }, { name: 'Creep', val: Creep }, { name: 'RoomPosition', val: RoomPosition }, { name: 'Source', val: Source }, { name: 'Flag', val: Flag }],

  record(functionName, time) {
    if (!Memory.profiler.map[functionName]) {
      Memory.profiler.map[functionName] = {
        time: 0,
        calls: 0
      };
    }
    Memory.profiler.map[functionName].calls++;
    Memory.profiler.map[functionName].time += time;
  },

  endTick() {
    if (Game.time >= Memory.profiler.enabledTick) {
      const cpuUsed = Game.cpu.getUsed();
      Memory.profiler.totalTime += cpuUsed;
      Profiler.report();
    }
  },

  report() {
    if (Profiler.shouldPrint()) {
      Profiler.printProfile();
    } else if (Profiler.shouldEmail()) {
      Profiler.emailProfile();
    }
  },

  isProfiling() {
    if (!enabled || !Memory.profiler) {
      return false;
    }
    return !Memory.profiler.disableTick || Game.time <= Memory.profiler.disableTick;
  },

  type() {
    return Memory.profiler.type;
  },

  shouldPrint() {
    const streaming = Profiler.type() === 'stream';
    const profiling = Profiler.type() === 'profile';
    const onEndingTick = Memory.profiler.disableTick === Game.time;
    return streaming || profiling && onEndingTick;
  },

  shouldEmail() {
    return Profiler.type() === 'email' && Memory.profiler.disableTick === Game.time;
  }
};

module.exports = {
  wrap(callback) {
    if (enabled) {
      setupProfiler();
    }

    if (Profiler.isProfiling()) {
      usedOnStart = Game.cpu.getUsed();

      // Commented lines are part of an on going experiment to keep the profiler
      // performant, and measure certain types of overhead.

      // var callbackStart = Game.cpu.getUsed();
      const returnVal = callback();
      // var callbackEnd = Game.cpu.getUsed();
      Profiler.endTick();
      // var end = Game.cpu.getUsed();

      // var profilerTime = (end - start) - (callbackEnd - callbackStart);
      // var callbackTime = callbackEnd - callbackStart;
      // var unaccounted = end - profilerTime - callbackTime;
      // console.log('total-', end, 'profiler-', profilerTime, 'callbacktime-',
      // callbackTime, 'start-', start, 'unaccounted', unaccounted);
      return returnVal;
    }

    return callback();
  },

  enable() {
    enabled = true;
    hookUpPrototypes();
  },

  output: Profiler.output,

  registerObject: profileObjectFunctions,
  registerFN: profileFunction,
  registerClass: profileObjectFunctions
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

var actOffensive = {
    heal: function (creep) {
        var target = Game.getObjectById(creep.memory.healCreep);
        if (target) {
            var err = creep.heal(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.healCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.healCreep;
        }
    },
    attack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.attackCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.attackCreep;
        }
    },
    rangedAttack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.rangedAttack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
                delete creep.memory.myTask;
                delete creep.memory.attackCreep;
            }
        } else {
            delete creep.memory.myTask;
            delete creep.memory.attackCreep;
        }
    },
    block: function (creep) {
        var block1Flag = Game.flags['blocker1'];
        var block2Flag = Game.flags['blocker2'];
        var block3Flag = Game.flags['blocker3'];
        var err = 0;
        if (!creep.memory.blockTarget && !creep.memory.done) {
            if (block1Flag) {
                err = creep.moveTo(block1Flag.pos);
                if (err == ERR_NO_PATH) {
                    if (block2Flag) {
                        var err = creep.moveTo(block2Flag.pos);
                        if (err == ERR_NO_PATH) {
                            if (block3Flag) {
                                var err = creep.moveTo(block3Flag.pos);
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
                err = creep.moveTo(blockTarget.pos);
                if (err = ERR_NO_PATH) {
                    delete creep.memory.blockTarget;
                }
            }
        }
    },
    gather: function (creep) {
        if (Memory.attackers.attacking) {
            creep.moveTo(Game.flags['Attack'].pos, { ignoreCreeps: true });
        } else {
            creep.moveTo(Game.flags['Marshal'].pos, { ignoreCreeps: true });
        }
    },
    renew: function (creep, mySpawns) {
        var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
        if (!mySpawns[0].memory.renewTarget && inRange) {
            mySpawns[0].memory.renewTarget = creep.id;
        } else if (!inRange) {
            creep.moveTo(mySpawns[0].pos);
        }
    },
    findTarget: function (creep) {
        if (creep.memory.role == 'healer') {
            findHealingTarget(creep);
        } else if (creep.memory.role == 'blocker') {
            creep.memory.myTask = 'block';
        } else {
            findAttackTarget(creep);
        }
    }
};
function findHealingTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        'filter': creep => creep.hits < creep.hitsMax
    });
    if (target) {
        creep.memory.healCreep = target.id;
    } else {
        delete creep.memory.healCreep;
    }
}
function findAttackTarget(creep) {
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
            filter: structure => structure.structureType != STRUCTURE_CONTROLLER
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
        creep.memory.myTask = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actOffensive);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actHarvest = {
    run: function (creep) {
        if (!creep.memory.sourceMap && !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
        if (!source) {
            getSource(creep);
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var err = creep.moveTo(source, { 'maxRooms': 1 });
        }
    }
};

function getSource(creep) {
    var nearestSource = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.tempSourceMap = nearestSource && nearestSource.id;
}

/* harmony default export */ __webpack_exports__["a"] = (actHarvest);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loop"] = loop;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__room__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__screeps_profiler__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__screeps_profiler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__screeps_profiler__);


// docs:
/*
place a flag names 'Attack' to designate the attack room and location
place a flag names 'Marshal' to designate a staging area.
To specify size, change forceSize on the Memory.attackers object
To tell a room to marshal a force, change the room flag 'marshalForce' to true
You can send a worker to another room by specifying the roomname on goToTarget and change their task name to goToTarget (make this global)

You can claim by placing a Claim flag setting myRoom.memory.spawnClaimer to the number of claimers you want
*/

__WEBPACK_IMPORTED_MODULE_1__screeps_profiler__["enable"]();

function loop() {
	__WEBPACK_IMPORTED_MODULE_1__screeps_profiler__["wrap"](function () {
		for (let name in Memory.creeps) {
			if (Game.creeps[name] == undefined) {
				delete Memory.creeps[name];
			}
		}
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

		for (let roomName in Game.rooms) {
			let Room = Game.rooms[roomName];
			__WEBPACK_IMPORTED_MODULE_0__room__["a" /* default */].run(Room);
		}
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
	});
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__role_upgrader__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__role_harvester__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__role_mule__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__role_worker__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__role_claimer__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__role_thief__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__role_thiefmule__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__role_offensive__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__spawner__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__task_manager__ = __webpack_require__(15);
















__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_1__role_upgrader__["a" /* default */], 'upgrader');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_2__role_harvester__["a" /* default */], 'harvester');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_3__role_mule__["a" /* default */], 'mule');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_4__role_worker__["a" /* default */], 'worker');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_5__role_claimer__["a" /* default */], 'claimer');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_6__role_thief__["a" /* default */], 'thief');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_8__role_offensive__["a" /* default */], 'run');

const Room = {
    run: function (myRoom) {
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
                case 'harvester':
                    myCreepCount.harvesterParts += creep_size;
                    myCreepCount.harvesterCount += 1;
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
                case 'thief':
                    myCreepCount.thiefParts += creep_size;
                    Memory.misc.globalCreepsTemp.thief += 1;
                    break;
                case 'thiefmule':
                    Memory.misc.globalCreepsTemp.thiefmule += 1;
                    break;
                case 'melee':
                    myCreepCount.meleeParts += creep.body.filter(part => part.type == ATTACK).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.melee += 1;
                    }
                    break;
                case 'ranged':
                    myCreepCount.rangedParts += creep.body.filter(part => part.type == RANGED_ATTACK).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.ranged += 1;
                    }
                    break;
                case 'healer':
                    myCreepCount.healerParts += creep.body.filter(part => part.type == HEAL).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.healer += 1;
                    }
                    break;
                case 'blocker':
                    myCreepCount.blockerParts += creep.body.filter(part => part.type == TOUGH).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.blocker += 1;
                    }
                    break;
                case 'tough':
                    myCreepCount.toughParts += creep.body.filter(part => part.type == TOUGH).length;
                    if (creep.hits == creep.hitsMax) {
                        Memory.misc.globalCreepsTemp.tough += 1;
                    }
                    break;
            }
        });

        myRoom.memory.myCreepCount = myCreepCount;
        let convert = null;
        myCreeps.forEach(creep => {
            switch (creep.memory.role) {
                default:
                case 'harvester':
                    __WEBPACK_IMPORTED_MODULE_2__role_harvester__["a" /* default */].run(creep);
                    break;
                case 'upgrader':
                    __WEBPACK_IMPORTED_MODULE_1__role_upgrader__["a" /* default */].run(creep);
                    break;
                case 'worker':
                    if (myCreepCount.harvesterCount < 2) {
                        convert = creep;
                    }
                    __WEBPACK_IMPORTED_MODULE_4__role_worker__["a" /* default */].run(creep);
                    break;
                case 'mule':
                    __WEBPACK_IMPORTED_MODULE_3__role_mule__["a" /* default */].run(creep);
                    break;
                case 'claimer':
                    __WEBPACK_IMPORTED_MODULE_5__role_claimer__["a" /* default */].run(creep);
                    break;
                case 'thief':
                    __WEBPACK_IMPORTED_MODULE_6__role_thief__["a" /* default */].run(creep);
                    break;
                case 'thiefmule':
                    __WEBPACK_IMPORTED_MODULE_7__role_thiefmule__["a" /* default */].run(creep);
                    break;
                case 'melee':
                case 'ranged':
                case 'healer':
                case 'blocker':
                case 'tough':
                    __WEBPACK_IMPORTED_MODULE_8__role_offensive__["a" /* default */].run(creep, mySpawns);
                    break;
            }
            __WEBPACK_IMPORTED_MODULE_10__task_manager__["a" /* default */].run(creep, mySpawns);
        });

        if (!myRoom.controller || myRoom.controller && !myRoom.controller.my) {
            myRoom.memory.owner = myRoom.controller && !!myRoom.controller.owner;

            myCreeps.forEach(creep => {
                if (creep.memory.role == 'thief') {
                    __WEBPACK_IMPORTED_MODULE_6__role_thief__["a" /* default */].run(creep);
                }
            });

            return false;
        }

        if (myRoom.find(FIND_HOSTILE_CREEPS).length > 0 && !myRoom.controller.safeMode && !myRoom.controller.safeModeCooldown && myRoom.controller.safeModeAvailable) {
            // myRoom.controller.activateSafeMode();
            // dont waste these!!
        }

        var myTowers = myRoom.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_TOWER);

        updateRoomConsts(myRoom);

        runTowers(myTowers);

        transferLinks(myRoom.memory.links);

        myRoom.memory.hasMules = myCreepCount.muleCount;
        __WEBPACK_IMPORTED_MODULE_9__spawner__["a" /* default */].run(myRoom, mySpawns, myCreepCount, totalCreeps, convert);
    }
};

function runTowers(myTowers) {
    myTowers.forEach(tower => {
        var minRepair = 20000;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (tower.energy > tower.energyCapacity / 2) {
            var repairTarget = 0;
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (creepToRepair != undefined) {
                tower.heal(creepToRepair);
                repairTarget = creepToRepair;
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER
                });
                for (let structure of structureList) {
                    if (structure.hits < structure.hitsMax) {
                        tower.repair(structure);
                        repairTarget = structure.id;
                        break;
                    }
                }
            }
            if (!repairTarget) {
                var structureList = tower.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL
                });
                for (let structure of structureList) {
                    if (structure.hits < structure.hitsMax && structure.hits < minRepair) {
                        tower.repair(structure);
                        repairTarget = structure.id;
                        break;
                    }
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
            if (link.energy > link.energyCapacity - 100) {
                give.push(link);
            } else if (link.energy == 0) {
                receive.push(link);
            }
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
    myRoom.memory.marshalForce = false;
    myRoom.memory.spawnClaimer = 0;
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if (Memory.methods.createRemoteWorkers) {
        Memory.methods.createRemoteWorkers -= 1;
        Memory.misc.requests.push({
            'role': 'worker',
            'myTask': 'goToTarget',
            'goToTarget': 'W41N51'
        });
    }
    if (myRoom.memory.timer % 300 == 0 || myRoom.memory.runUpdate) {
        myRoom.memory.runUpdate = false;
        // TODO Make this equal to the amount of energy in the room, not hardcoded
        // TODO this isnt triggering. hardcode trigger in spawn? WHY DOESNT THIS SET
        console.log('ration time: ' + String(myRoom.memory.timer));
        console.log('ration room: ' + String(myRoom.name));
        console.log('ration update: ' + String(myRoom.memory.energyRation));
        myRoom.memory.energyRation = 5000;
        myRoom.memory.structures = {};
        console.log('ration update: ' + String(myRoom.memory.energyRation));
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

        myRoom.memory.links = links.map(link => link.id);

        myRoom.memory.hasStorage = storage.length > 0;
        myRoom.memory.hasContainers = container.length > 0;
        myRoom.memory.hasLinks = links.length > 1;

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

/* harmony default export */ __webpack_exports__["a"] = (Room);

/***/ }),
/* 6 */
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleHarvester = {
	run: function (creep) {
		if (creep.fatigue != 0) {
			return;
		}

		if (creep.carry.energy <= 49) {
			creep.memory.myTask = 'harvest';
		}

		if (creep.carryCapacity == creep.carry.energy) {
			creep.memory.myTask = 'deposit';
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (roleHarvester);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleMule = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }
        if (creep.carry.energy == 0) {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
        } else if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleMule);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleWorker = {
	run: function (creep) {
		if (creep.fatigue != 0) {
			return;
		}

		if ((creep.memory.myTask == 'repair' || creep.memory.myTask == 'build' || creep.memory.myTask == 'upgrade') && creep.carry.energy == 0) {
			creep.memory.myTask = 'resupply';
		}
		if (creep.memory.myTask == 'resupply' && creep.carry.energy == creep.carryCapacity) {
			creep.memory.myTask = 'build';
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (roleWorker);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleClaimer = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (Game.flags['Claim']) {
            creep.memory.myTask = 'claim';
        } else if (creep.memory.myTask) {
            delete creep.memory.myTask;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleClaimer);

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleThief = {
    run: function (creep) {
        if (!creep.memory.stealTarget) {
            // TODO fix !!!!
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52'];

            // const exits = Game.map.describeExits(creep.room.name)
            // for (name in exits) {
            //     // This is still breaking
            //     if (Game.map.isRoomAvailable(exits[name]) && !(Memory.rooms[name] && !Memory.rooms[name].owner)) {
            //         possibleTargets.push(exits[name])
            //     }
            // }
            if (possibleTargets.length <= Memory.stealFlag) {
                Memory.stealFlag = 1;
            } else {
                Memory.stealFlag += 1;
            }
            creep.memory.goToTarget = possibleTargets[Memory.stealFlag - 1];
            creep.memory.stealTarget = possibleTargets[Memory.stealFlag - 1];
        }

        if (creep.room.name == creep.memory.stealTarget) {
            if (creep.carry.energy == 0) {
                creep.memory.myTask = 'harvest';
            } else if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.myTask = 'lazydeposit';
            }
        } else {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThief);

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleThiefMule = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (!creep.memory.stealTarget) {
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52'];
            const homeArray = ['W43N53', 'W41N51', 'W41N51', 'W43N53', 'W43N53', 'W41N51', 'W45N53'];

            if (possibleTargets.length <= Memory.muleFlag) {
                Memory.muleFlag = 1;
            } else {
                Memory.muleFlag += 1;
            }
            creep.memory.goToTarget = possibleTargets[Memory.muleFlag - 1];
            creep.memory.stealTarget = possibleTargets[Memory.muleFlag - 1];
            creep.memory.home = homeArray[Memory.muleFlag - 1];
        }
        if (creep.carry.energy == 0 && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        }
        if (creep.carryCapacity == creep.carry.energy && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        }
        if (creep.carry.energy == 0 && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        }
        if (creep.carryCapacity == creep.carry.energy && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThiefMule);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_offensive__ = __webpack_require__(2);



const roleOffensive = {
    run(creep, mySpawns) {
        if (Memory.attackers.attacking) {
            //&& !attackFlag.room.controller.safeMode) {
            // move to and attack
            if (!Game.flags['Attack']) {
                console.log('Place Attack flag');
                return null;
            }
            var attackFlag = Game.flags['Attack'];
            if (creep.room.name == attackFlag.pos.roomName) {
                if (creep.memory.myTask != 'heal' && creep.memory.myTask != 'attack' && creep.memory.myTask != 'block') {
                    __WEBPACK_IMPORTED_MODULE_1__action_offensive__["a" /* default */].findTarget(creep);
                    if (creep.memory.healCreep) {
                        creep.memory.myTask = 'heal';
                    } else if (creep.memory.attackCreep) {
                        switch (creep.memory.role) {
                            case 'ranged':
                                creep.memory.myTask = 'rangedAttack';
                                break;
                            case 'melee':
                                creep.memory.myTask = 'attack';
                                break;
                            default:
                                creep.memory.myTask = 'attack';
                                break;
                        }
                    } else if (creep.memory.myTask == 'block') {
                        return;
                    } else {
                        creep.memory.myTask = 'gather';
                    }
                }
            } else if (creep.memory.myTask != 'goToTarget') {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                creep.memory.myTask = 'goToTarget';
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
                if (creep.memory.myTask == 'renew' && creep.ticksToLive > 1400) {
                    delete creep.memory.myTask;
                }
                if (creep.ticksToLive < 1000 || creep.memory.myTask == 'renew') {
                    creep.memory.myTask = 'renew';
                } else {
                    creep.memory.myTask = 'gather';
                }
            } else if (creep.memory.myTask != 'goToTarget') {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                creep.memory.myTask = 'goToTarget';
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleOffensive);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const spawner = {
    run: function (myRoom, mySpawns, myCreepCount, totalCreeps, convert) {
        var MaxParts = {
            'harvester': 6, // definitely
            'worker': 6,
            'mule': 10,
            'upgrader': 6,
            'thief': 6,
            'melee': 70,
            'ranged': 70,
            'healer': 10,
            'blocker': 2 //not used current
        };
        var MaxHarvesterCount = myRoom.memory.hasLinks || myRoom.memory.hasContainers ? 2 : 4;
        var MaxHarvesterCount = myRoom.memory.hasLinks || myRoom.memory.hasContainers ? 2 : 4;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        var MaxWorkerCount = myRoom.memory.marshalForce ? 1 : 2;
        var MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasLinks ? 2 : MaxMuleCount;
        var MaxUpgraderCount = myRoom.memory.hasLinks ? 0 : 0;
        var MaxThiefCount = myRoom.memory.marshalForce ? 0 : 7;
        var MaxThiefMuleCount = MaxThiefCount * 2;
        var MaxMeleeCount = myRoom.memory.marshalForce ? Memory.attackers.forceSize - 3 : 0;
        var MaxRangedCount = myRoom.memory.marshalForce ? 2 : 0;
        var MaxHealerCount = myRoom.memory.marshalForce ? 1 : 0;
        var MaxBlockerCount = myRoom.memory.marshalDisrupter ? 20 : 0;
        var MaxToughCount = myRoom.memory.marshalForce ? 5 : 0;
        var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
        var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;

        mySpawns.forEach(Spawn => {
            if (!Spawn.spawning) {
                var sourceMapNumber = 99;
                var sourceMap = 0;

                // TODO kill this as this is just a safetycheck
                // if (!myRoom.memory.sources) {myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);}

                myRoom.memory.sources.forEach(source => {
                    if ((myCreepCount.sourceMap[source] || 0) < sourceMapNumber) {
                        sourceMapNumber = myCreepCount.sourceMap[source] || 0;
                        sourceMap = source;
                    }
                });
                let canSpawn = true;
                if (myCreepCount.harvesterCount < 1) //just in case, if there are no harvesters spawn a harvester
                    {
                        Spawn.spawnCreep([WORK, CARRY, MOVE], 'HarvesterLow' + Game.time, {
                            memory: {
                                'role': 'harvester',
                                'sourceMap': sourceMap
                            }
                        });
                    }

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
                if (myCreepCount.harvesterParts < MaxParts.harvester * MaxHarvesterCount && myCreepCount.harvesterCount < MaxHarvesterCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.harvester, { 'harvester': true }), newName, {
                        memory: {
                            'role': 'harvester',
                            'sourceMap': sourceMap
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
                            'role': 'claimer'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if (myCreepCount.workerParts < MaxParts.worker * MaxWorkerCount && myCreepCount.workerCount < MaxWorkerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Worker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.worker), newName, {
                        memory: {
                            'role': 'worker'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (convert && myCreepCount.harvesterCount < 2 && canSpawn && myRoom.energyAvailable <= referenceEnergy * 0.75) {
                    convert.memory.role = 'harvester';
                    convert.memory.sourceMap = sourceMap;
                    canSpawn = false;
                }
                if (myCreepCount.muleParts < MaxParts.mule * MaxMuleCount && myCreepCount.muleCount < MaxMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, { 'carryOnly': true }), newName, {
                        memory: {
                            'role': 'mule'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.upgraderParts < MaxUpgraderCount && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.upgrader), newName, {
                        memory: {
                            'role': 'upgrader'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.thiefParts < MaxParts.thief * MaxThiefCount && Memory.misc.globalCreeps.thief < MaxThiefCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Thief' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.thief), newName, {
                        memory: {
                            'role': 'thief'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (Memory.misc.globalCreeps.thiefmule < MaxThiefMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'ThiefMule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, { 'carryOnly': true }), newName, {
                        memory: {
                            'role': 'thiefmule'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.meleeParts < MaxParts.melee * MaxMeleeCount && Memory.misc.globalCreeps.melee < MaxMeleeCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Melee' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.melee, { 'melee': true }), newName, {
                        memory: {
                            'role': 'melee'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.healerParts < MaxParts.healer * MaxHealerCount && Memory.misc.globalCreeps.healer < MaxHealerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Healer' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.healer, { 'healer': true }), newName, {
                        memory: {
                            'role': 'healer'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.rangedParts < MaxParts.ranged * MaxRangedCount && Memory.misc.globalCreeps.ranged < MaxRangedCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Ranged' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.ranged, { 'ranged': true }), newName, {
                        memory: {
                            'role': 'ranged'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.blockerParts < MaxParts.blocker * MaxBlockerCount && Memory.misc.globalCreeps.blocker < MaxBlockerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Blocker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.blocker, { 'blocker': true }), newName, {
                        memory: {
                            'role': 'blocker'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.toughParts < MaxParts.tough * MaxToughCount && Memory.misc.globalCreeps.tough < MaxToughCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Tough' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.tough, { 'tough': true }), newName, {
                        memory: {
                            'role': 'tough'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    completeOutstandingRequests(myRoom, Spawn);
                }
            }
        });
    }
};

function completeOutstandingRequests(myRoom, Spawn) {
    if (Memory.misc.requests.length) {
        var newName = Memory.misc.requests[0].role + Game.time;
        Spawn.spawnCreep(getBody(myRoom), newName, {
            memory: Memory.misc.requests[0]
        });
        Memory.misc.requests.splice(0, 1);
        console.log('Spawning: ' + newName);
    }
}

function getBody(myRoom, MaxParts, options = {}) {
    var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
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
    if (options.melee) {
        for (var i = 0; i < Math.floor(referenceEnergy / 130) && i < MaxParts; i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.healer) {
        for (var i = 0; i < Math.floor(referenceEnergy / 300) && i < MaxParts; i += 1) {
            partArray.push(HEAL);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.ranged) {
        for (var i = 0; i < Math.floor(referenceEnergy / 200) && i < MaxParts; i += 1) {
            partArray.push(RANGED_ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    let workCount = 0;
    if (options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount = 1;
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK);
            partArray.push(MOVE);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts) {
                partArray.push(WORK);
                partArray.push(WORK);
                workCount += 2;
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    if (options.harvester) {
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
        }
        return partArray;
    }
    while (totalEnergy >= 4 && workCount < MaxParts) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            totalEnergy -= 2;
        }
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 2;
        workCount += 1;
    }
    return partArray;
}

/* harmony default export */ __webpack_exports__["a"] = (spawner);

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_deposit__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_resupply__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_claim__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__action_harvest__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__action_upgrade__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__action_build__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__action_offensive__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util__ = __webpack_require__(0);










const taskManager = {
    run: function (creep, mySpawns) {
        switch (creep.memory.myTask) {
            case 'claim':
                __WEBPACK_IMPORTED_MODULE_2__action_claim__["a" /* default */].run(creep);
                break;
            case 'fetch':
                __WEBPACK_IMPORTED_MODULE_1__action_resupply__["a" /* default */].getEnergy(creep);
                break;
            case 'deposit':
                __WEBPACK_IMPORTED_MODULE_0__action_deposit__["a" /* default */].run(creep, creep.memory.role == 'mule');
                break;
            case 'lazydeposit':
                __WEBPACK_IMPORTED_MODULE_0__action_deposit__["a" /* default */].lazydeposit(creep);
                break;
            case 'harvest':
                __WEBPACK_IMPORTED_MODULE_3__action_harvest__["a" /* default */].run(creep);
                break;
            case 'goToTarget':
                __WEBPACK_IMPORTED_MODULE_7__util__["a" /* default */].goToTarget(creep);
                break;
            case 'upgrade':
                __WEBPACK_IMPORTED_MODULE_4__action_upgrade__["a" /* default */].run(creep);
                break;
            case 'resupply':
                __WEBPACK_IMPORTED_MODULE_1__action_resupply__["a" /* default */].run(creep);
                break;
            case 'repair':
            case 'build':
                __WEBPACK_IMPORTED_MODULE_5__action_build__["a" /* default */].run(creep);
                break;
            case 'heal':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].heal(creep);
                break;
            case 'attack':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].attack(creep);
                break;
            case 'rangedAttack':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].rangedAttack(creep);
                break;
            case 'block':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].block(creep);
                break;
            case 'gather':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].gather(creep);
                break;
            case 'renew':
                __WEBPACK_IMPORTED_MODULE_6__action_offensive__["a" /* default */].renew(creep, mySpawns);
                break;
            default:
                switch (creep.memory.role) {
                    case 'worker':
                        creep.memory.myTask = 'resupply';
                        __WEBPACK_IMPORTED_MODULE_1__action_resupply__["a" /* default */].run(creep);
                        break;
                    case 'mule':
                        creep.memory.myTask = 'fetch';
                        break;
                    default:
                        creep.memory.myTask = 'harvest';
                        break;
                }
                break;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (taskManager);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actDeposit = {
    run: function (creep, isMule) {
        //if I'm carrying something that is not energy
        var currentEnergy = creep.carry.energy;
        if (_.sum(creep.carry) != currentEnergy) {
            deposit_resource(creep);
        } else if (!creep.memory.depositTarget) {
            deposit_target(creep, isMule);
        }
        var target = Game.getObjectById(creep.memory.depositTarget);
        if (target) {
            var err = creep.transfer(target, RESOURCE_ENERGY);
            if (err = ERR_INVALID_ARGS) {
                var err = creep.transfer(target, RESOURCE_ENERGY, target.energyCapacity - target.energy || target.storeCapacity && target.storeCapacity - target.store.energy);
            }
            if (err == ERR_NOT_IN_RANGE) {
                // Return early to prevent deletion of the deposit target
                return creep.moveTo(target, { 'visualizePathStyle': { stroke: '#ffffff' }, 'maxRooms': 1 });
            } else if (err == OK) {
                // Adjust the promise on this object now it has been delivered
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
            if (lazyContainer) {
                if (lazyContainer.hits < lazyContainer.hitsMax / 2) {
                    creep.repair(lazyContainer);
                } else {
                    var err = creep.transfer(lazyContainer, RESOURCE_ENERGY);
                    if (err == ERR_FULL || err == ERR_INVALID_ARGS || err == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.drop(RESOURCE_ENERGY);
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lazyContainer.pos, { 'maxRooms': 1 });
                    }
                }
            } else {
                delete creep.memory.lazyContainer;
            }
        } else {
            var const_site = creep.pos.findInRange(FIND_MY_CONSTRUCTION_SITES, 2);
            if (const_site.length > 0) {
                creep.build(const_site[0]);
            } else {
                var container_site = creep.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: structure => structure.structureType == STRUCTURE_CONTAINER
                });
                if (container_site.length > 0) {
                    creep.memory.lazyContainer = container_site[0].id;
                } else {
                    // Could create it on the creep for guanranteed space, but I am pretty sure you cant build on what you are standing on
                    for (var x = -1; x < 2; x += 1) {
                        for (var y = -1; y < 2; y += 1) {
                            var err = creep.room.createConstructionSite(creep.pos.x + x, creep.pos.y + y, STRUCTURE_CONTAINER);
                            if (OK == err) {
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
};

function deposit_target(creep, isMule = false) {
    // Mule is the only one which will refuse to drop to a container
    var economy = creep.room.memory.myCreepCount.muleCount && creep.room.memory.myCreepCount.harvesterCount > 0;
    if (creep.room.memory.hasContainers && economy && !isMule) {
        // We can use local links and containers and rely on mules for transport
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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

    if (creep.room.memory.energyRation > 0) {
        // We must deposit to the nearest none full spawn or extension
        // We do declare that this energy will be given. Promise ticks down 1 energy per tick, if it reaches 0
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            'filter': structure => {
                return (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && !(creep.room.memory.structures[structure.id] && creep.room.memory.structures[structure.id].energyRationPromise >= structure.energyCapacity - structure.energy) && structure.energy < structure.energyCapacity;
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
            return structure.structureType == STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity;
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

function deposit_resource(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
            return structure.structureType == STRUCTURE_STORAGE;
        }
    });
    //TODO: figure out what the command for deposit all is
    var err;
    if (target != undefined) {
        for (const resourceType in creep.carry) {
            err = creep.transfer(target, resourceType);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { 'maxRooms': 1 });
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actDeposit);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(3);


const actResupply = {
    run: function (creep) {
        //find the closest containr or storage that has enough energy to fill me
        //it's been a while since I looked into this, jeeze this eats up a lot of CPU, this should check once then head towards it
        //TODO: make this not suck CPU, save the target etc.
        if (!creep.memory.resupplyTarget) {
            getResupplyTarget(creep);
        }
        if (creep.memory.resupplyTarget) {
            var resupplyTarget = Game.getObjectById(creep.memory.resupplyTarget);
            var err = resupplyTarget && creep.withdraw(resupplyTarget, RESOURCE_ENERGY);
            if (err == OK || err == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.resupplyTarget = 0;
            } else if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(resupplyTarget, { 'visualizePathStyle': { stroke: '#ffffff' }, 'maxRooms': 1 });
            } else {
                getResupplyTarget(creep);
            }
        } else {
            __WEBPACK_IMPORTED_MODULE_0__action_harvest__["a" /* default */].run(creep);
        }
    },
    getEnergy: function (creep) {
        if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
            getTargets(creep);
        }
        var target = 0;
        if (creep.memory.dropTarget) {
            target = Game.getObjectById(creep.memory.dropTarget);
            var err = target && creep.pickup(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { 'maxRooms': 1 });
            } else if (err == OK) {
                creep.memory.dropTarget = 0;
            } else {
                getTargets(creep);
            }
        } else if (creep.memory.fetchTarget) {
            target = Game.getObjectById(creep.memory.fetchTarget);
            var err = target && creep.withdraw(target, RESOURCE_ENERGY);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { 'maxRooms': 1 });
            } else if (err == OK) {
                creep.memory.fetchTarget = 0;
            } else {
                getTargets(creep);
            }
        }
    }
};

function getTargets(creep) {
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
        creep.memory.dropTarget = target.id;
        creep.memory.fetchTarget = 0;
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0;
            }
        });
        if (target) {
            creep.memory.fetchTarget = target.id;
            creep.memory.dropTarget = 0;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_STORAGE && structure.store.energy > 0;
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
                creep.memory.dropTarget = 0;
            }
        }
    }
}

function getResupplyTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
            return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy > 0 || structure.storeCapacity && structure.store.energy > 0);
        }
    });
    if (target) {
        creep.memory.resupplyTarget = target.id;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actResupply);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const actClaim = {
    run: function (creep) {
        if (creep.room.name == Game.flags['Claim'].pos.roomName) {
            let err = creep.claimController(creep.room.controller);
            if (err == ERR_INVALID_TARGET) {
                err = creep.attackController(creep.room.controller);
            }
            if (err == ERR_INVALID_TARGET) {
                // If the claimers actions are both invalid, might have to reserve here as well? Need logic for reserve on weak rooms anyway
                delete creep.memory.myTask;
            }
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.flags['Claim'].pos, { 'maxRooms': 1 });
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                creep.moveTo(Game.flags['Claim'].pos, { 'maxRooms': 1 });
            }
        } else {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actClaim);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var actUpgrade = {
    run: function (creep) {
        if (creep.memory.MyController == undefined) {
            creep.memory.MyController = creep.room.controller && creep.room.controller.id;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if (creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actUpgrade);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actBuild = {
    run: function (creep) {
        //do I already have something to build? If not find something to fix and say fixit
        if (!creep.memory.myBuildTarget && !creep.memory.myRepairTarget) {
            findBuildTarget(creep);
            if (!creep.memory.myBuildTarget) {
                creep.memory.myTask = 'upgrade';
                // towers can repair instead
                // findRepairTarget(creep);
                // if (!creep.memory.myRepairTarget) {
                // }
            }
        } else {
            if (creep.memory.myBuildTarget) {
                var target = Game.getObjectById(creep.memory.myBuildTarget);
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                if (!target) {
                    findBuildTarget(creep);
                }
            } else if (creep.memory.myRepairTarget) {
                var target = Game.getObjectById(creep.memory.myRepairTarget);
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                if (!target || target.hits == target.hitsMax) {
                    findBuildTarget(creep);
                    findRepairTarget(creep);
                }
            }
        }
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

/***/ })
/******/ ]);