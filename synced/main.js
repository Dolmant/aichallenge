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
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget)));
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
        var source = Game.getObjectById(creep.memory.sourceMap || creep.memory.tempSourceMap);
        if (!source) {
            getSource(creep);
        } else if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            var err = creep.moveTo(source);
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
var actUpgrade = {
    run: function (creep) {
        if (creep.memory.MyController == undefined) {
            creep.memory.MyController = creep.room.controller.id;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if (creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (actUpgrade);

/***/ }),
/* 3 */
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
                return creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
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
    if (target != undefined) {
        creep.moveTo(target);
        for (const resourceType in creep.carry) {
            creep.transfer(target, resourceType);
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actDeposit);

/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(1);


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
                creep.moveTo(resupplyTarget, { visualizePathStyle: { stroke: '#ffffff' } });
            } else {
                getResupplyTarget(creep);
            }
        } else {
            __WEBPACK_IMPORTED_MODULE_0__action_harvest__["a" /* default */].run(creep);
        }
    }
};

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
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loop"] = loop;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__room__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__screeps_profiler__ = __webpack_require__(4);
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
			'claimer': 0
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
			'claimer': Memory.misc.globalCreepsTemp.claimer
		};
	});
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__role_upgrader__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__role_harvester__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__role_mule__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__role_worker__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__role_claimer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__role_thief__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__role_melee__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__role_ranged__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__role_healer__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__spawner__ = __webpack_require__(17);















__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_1__role_upgrader__["a" /* default */], 'upgrader');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_2__role_harvester__["a" /* default */], 'harvester');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_3__role_mule__["a" /* default */], 'mule');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_4__role_worker__["a" /* default */], 'worker');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_5__role_claimer__["a" /* default */], 'claimer');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_6__role_thief__["a" /* default */], 'thief');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_7__role_melee__["a" /* default */], 'melee');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_8__role_ranged__["a" /* default */], 'ranged');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_9__role_healer__["a" /* default */], 'healer');

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
            'harvesterCount': 0,
            'upgraderCount': 0,
            'workerCount': 0,
            'muleCount': 0,
            'claimCount': 0,
            'thiefCount': 0,
            'meleeCount': 0,
            'rangedCount': 0,
            'healerCount': 0
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
            }
        });

        myRoom.memory.myCreepCount = myCreepCount;
        myCreeps.forEach(creep => {
            switch (creep.memory.role) {
                default:
                case 'harvester':
                    __WEBPACK_IMPORTED_MODULE_2__role_harvester__["a" /* default */].run(creep);
                    break;
                case 'upgrader':
                    __WEBPACK_IMPORTED_MODULE_1__role_upgrader__["a" /* default */].run(creep);
                    break;
                // legacy, remove
                case 'builder':
                case 'worker':
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
                case 'melee':
                    __WEBPACK_IMPORTED_MODULE_7__role_melee__["a" /* default */].run(creep, mySpawns);
                    break;
                case 'ranged':
                    __WEBPACK_IMPORTED_MODULE_8__role_ranged__["a" /* default */].run(creep, mySpawns);
                    break;
                case 'healer':
                    __WEBPACK_IMPORTED_MODULE_9__role_healer__["a" /* default */].run(creep, mySpawns);
                    break;
            }
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
        __WEBPACK_IMPORTED_MODULE_10__spawner__["a" /* default */].run(myRoom, mySpawns, myCreepCount, totalCreeps);
    }
};

function runTowers(myTowers) {
    myTowers.forEach(tower => {
        var minRepair = 10000;
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        } else if (tower.energy > tower.energyCapacity / 2) {
            var structureList = tower.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_RAMPART || s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_ROAD || s.structureType == STRUCTURE_CONTAINER
            });
            for (let structure of structureList) {
                if (structure.hits < structure.hitsMax && structure.hits < minRepair) //this could be a problem during an assault where towers start repairing instead of attacking.
                    {
                        tower.repair(structure);
                        break;
                    }
            }
            var creepToRepair = tower.pos.findClosestByRange(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
            if (creepToRepair != undefined) {
                tower.heal(creepToRepair);
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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_resupply__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_upgrade__ = __webpack_require__(2);



const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (!(creep.memory.myTask == 'upgrading') && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'upgrading';
        }
        if (creep.carry.energy == 0) {
            creep.memory.myTask = 'resupply';
        }
        switch (creep.memory.myTask) {
            default:
            case 'upgrading':
                __WEBPACK_IMPORTED_MODULE_1__action_upgrade__["a" /* default */].run(creep);
                break;
            case 'resupply':
                __WEBPACK_IMPORTED_MODULE_0__action_resupply__["a" /* default */].run(creep);
                break;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleUpgrader);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_deposit__ = __webpack_require__(3);



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

		switch (creep.memory.myTask) {
			case 'harvest':
				//get more energy
				__WEBPACK_IMPORTED_MODULE_0__action_harvest__["a" /* default */].run(creep);
				break;
			case 'deposit':
				__WEBPACK_IMPORTED_MODULE_1__action_deposit__["a" /* default */].run(creep, false);
				break;
			default:
				creep.memory.myTask = 'harvest';
				break;
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (roleHarvester);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_deposit__ = __webpack_require__(3);


const roleMule = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }
        if (creep.carry.energy == 0) {
            creep.memory.myTask = 'fetch';
            creep.memory.depositTarget = 0;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.fetchTarget = 0;
            creep.memory.dropTarget = 0;
            creep.memory.myTask = 'deposit';
        }

        switch (creep.memory.myTask) {
            case 'fetch':
                //get more energy
                getEnergy(creep);
                break;
            case 'deposit':
                //go fill somethings energy
                __WEBPACK_IMPORTED_MODULE_0__action_deposit__["a" /* default */].run(creep, true);
                break;
            default:
                //uhoh
                creep.memory.myTask = 'fetch';
                break;
        }
    }
};
function getEnergy(creep) {
    if (!creep.memory.fetchTarget && !creep.memory.dropTarget) {
        getTargets(creep);
    }
    var target = 0;
    if (creep.memory.dropTarget) {
        target = Game.getObjectById(creep.memory.dropTarget);
        var err = target && creep.pickup(target);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (err == OK) {
            creep.memory.dropTarget = 0;
        } else {
            getTargets(creep);
        }
    } else if (creep.memory.fetchTarget) {
        target = Game.getObjectById(creep.memory.fetchTarget);
        var err = target && creep.withdraw(target, RESOURCE_ENERGY);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        } else if (err == OK) {
            creep.memory.fetchTarget = 0;
        } else {
            getTargets(creep);
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (roleMule);

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

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_upgrade__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_resupply__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__(0);




const roleWorker = {

	/** @param {Creep} creep **/
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
		switch (creep.memory.myTask) {
			case 'resupply':
				//hungry, go eat
				__WEBPACK_IMPORTED_MODULE_1__action_resupply__["a" /* default */].run(creep);
				break;
			case 'upgrade':
				__WEBPACK_IMPORTED_MODULE_0__action_upgrade__["a" /* default */].run(creep);
				break;
			case 'repair':
			case 'build':
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
				break;
			case 'goToTarget':
				__WEBPACK_IMPORTED_MODULE_2__util__["a" /* default */].goToTarget(creep);
				break;
			default:
				console.log('agent: ' + creep.name + " the worker did not have an action.");
				creep.memory.myTask = 'resupply';
				__WEBPACK_IMPORTED_MODULE_1__action_resupply__["a" /* default */].run(creep);
				break;
		}
	}
};

/* harmony default export */ __webpack_exports__["a"] = (roleWorker);

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

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleClaimer = {
    run: function (creep) {
        if (creep.fatigue != 0) {
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
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleClaimer);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__action_upgrade__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__action_deposit__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(0);





const roleThief = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (!creep.memory.home) {
            creep.memory.home = {
                room: creep.room.name,
                x: creep.pos.x,
                y: creep.pos.y
            };
        }
        if (!creep.memory.goToTarget) {
            // TODO fix !!!!
            const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53']; // 'W43N51' not owned yet
            // const exits = Game.map.describeExits(creep.room.name)
            // for (name in exits) {
            //     // This is stil lbreaking
            //     if (Game.map.isRoomAvailable(exits[name]) && !(Memory.rooms[name] && !Memory.rooms[name].owner)) {
            //         possibleTargets.push(exits[name])
            //     }
            // }
            if (possibleTargets.length <= creep.room.memory.stealFlag) {
                creep.room.memory.stealFlag = 1;
            } else {
                creep.room.memory.stealFlag += 1;
            }
            creep.memory.goToTarget = possibleTargets[creep.room.memory.stealFlag - 1];
        }

        if (creep.room.name == creep.memory.goToTarget) {
            creep.memory.myTask = 'harvest';
        } else if (creep.carry.energy == 0) {
            creep.memory.myTask = 'goToTarget';
        }

        if (creep.room.name == creep.memory.home.room && creep.carry.energy > 0) {
            if (creep.memory.secondaryRole == 'upgrader') {
                creep.memory.myTask = 'upgrading';
            } else {
                creep.memory.myTask = 'deposit';
            }
        } else if (creep.carryCapacity == creep.carry.energy) {
            creep.memory.myTask = 'goHome';
        }

        switch (creep.memory.myTask) {
            case 'goToTarget':
                __WEBPACK_IMPORTED_MODULE_3__util__["a" /* default */].goToTarget(creep);
                break;
            case 'harvest':
                __WEBPACK_IMPORTED_MODULE_0__action_harvest__["a" /* default */].run(creep);
                break;
            case 'goHome':
                var homepath = new RoomPosition(creep.memory.home.x, creep.memory.home.y, creep.memory.home.room);
                creep.moveTo(homepath);
                break;
            case 'upgrading':
                __WEBPACK_IMPORTED_MODULE_1__action_upgrade__["a" /* default */].run(creep);
                break;
            case 'deposit':
                __WEBPACK_IMPORTED_MODULE_2__action_deposit__["a" /* default */].run(creep, false);
                break;
            default:
                creep.memory.myTask = 'harvest';
                break;
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThief);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleMelee = {
    run(creep, mySpawns) {
        // move to and attack
        if (!Game.flags['Attack']) {
            console.log('Place Attack flag');
            return null;
        }
        var attackFlag = Game.flags['Attack'];
        // implement this
        if (Memory.attackers.attacking) {
            //&& !attackFlag.room.controller.safeMode) {
            if (creep.room.name == attackFlag.pos.roomName) {
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
                    } else {
                        findTarget(creep);
                    }
                } else {
                    creep.moveTo(attackFlag.pos, { ignoreCreeps: true });
                }
            } else {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
                if (creep.memory.renewing && creep.ticksToLive > 1400) {
                    delete creep.memory.renewing;
                }
                if (creep.ticksToLive < 1000 || creep.memory.renewing) {
                    var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
                    if (!mySpawns[0].memory.renewTarget && inRange) {
                        mySpawns[0].memory.renewTarget = creep.id;
                    } else if (!inRange) {
                        creep.moveTo(mySpawns[0].pos);
                    }
                    creep.memory.renewing = true;
                } else {
                    creep.moveTo(marshalFlag.pos);
                }
            } else {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleMelee);

function findTarget(creep) {
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
    if (target) {
        creep.memory.attackCreep = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleRanged = {
    run(creep, mySpawns) {
        // move to and attack
        if (!Game.flags['Attack']) {
            console.log('Place Attack flag');
            return null;
        }
        var attackFlag = Game.flags['Attack'];
        if (Memory.attackers.attacking) {
            // && !attackFlag.room.controller.safeMode) {
            if (creep.room.name == attackFlag.pos.roomName) {
                if (!creep.memory.attackCreep) {
                    findTarget(creep);
                }
                if (creep.memory.attackCreep) {
                    var target = Game.getObjectById(creep.memory.attackCreep);
                    if (target) {
                        var err = creep.rangedAttack(target);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.pos);
                        } else if (err == ERR_INVALID_TARGET) {
                            findTarget(creep);
                        }
                    } else {
                        findTarget(creep);
                    }
                } else {
                    creep.moveTo(attackFlag.pos, { ignoreCreeps: true });
                }
            } else {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
                if (creep.memory.renewing && creep.ticksToLive > 1400) {
                    delete creep.memory.renewing;
                }
                if (creep.ticksToLive < 1000 || creep.memory.renewing) {
                    var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
                    if (!mySpawns[0].memory.renewTarget && inRange) {
                        mySpawns[0].memory.renewTarget = creep.id;
                    } else if (!inRange) {
                        creep.moveTo(mySpawns[0].pos);
                    }
                    creep.memory.renewing = true;
                } else {
                    creep.moveTo(marshalFlag.pos);
                }
            } else {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleRanged);

function findTarget(creep) {
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
    if (target) {
        creep.memory.attackCreep = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);


const roleHealer = {
    run(creep, mySpawns) {
        // move to and attack
        if (!Game.flags['Attack']) {
            console.log('Place Attack flag');
            return null;
        }
        var attackFlag = Game.flags['Attack'];
        if (Memory.attackers.attacking) {
            //&& !attackFlag.room.controller.safeMode) {
            if (creep.room.name == attackFlag.pos.roomName) {
                if (!creep.memory.healCreep) {
                    findTarget(creep);
                }
                if (creep.memory.healCreep) {
                    var target = Game.getObjectById(creep.memory.healCreep);
                    if (target) {
                        var err = creep.heal(target);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target.pos);
                        } else if (err == ERR_INVALID_TARGET) {
                            findTarget(creep);
                        }
                    } else {
                        findTarget(creep);
                    }
                } else {
                    creep.moveTo(attackFlag.pos, { ignoreCreeps: true });
                }
            } else {
                creep.memory.goToTarget = attackFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        } else {
            if (!Game.flags['Marshal']) {
                console.log('Place Marshal flag');
                return null;
            }
            var marshalFlag = Game.flags['Marshal'];
            if (creep.room.name == marshalFlag.pos.roomName) {
                if (creep.memory.renewing && creep.ticksToLive > 1400) {
                    delete creep.memory.renewing;
                }
                if (creep.ticksToLive < 1000 || creep.memory.renewing) {
                    var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
                    if (!mySpawns[0].memory.renewTarget && inRange) {
                        mySpawns[0].memory.renewTarget = creep.id;
                    } else if (!inRange) {
                        creep.moveTo(mySpawns[0].pos);
                    }
                } else {
                    creep.moveTo(marshalFlag.pos);
                }
            } else {
                creep.memory.goToTarget = marshalFlag.pos.roomName;
                __WEBPACK_IMPORTED_MODULE_0__util__["a" /* default */].goToTarget(creep);
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleHealer);

function findTarget(creep) {
    var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
        'filter': creep => creep.hits < creep.hitsMax
    });
    if (target) {
        creep.memory.healCreep = target.id;
    } else {
        delete creep.memory.healCreep;
    }
}

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

const spawner = {
    run: function (myRoom, mySpawns, myCreepCount, totalCreeps) {
        // These all relate to the number of work parts except Mule which is carry
        var MaxHarvesterParts = 12; // definitely
        var MaxWorkerParts = 12;
        var MaxMuleParts = 20;
        var MaxUpgraderParts = 24;
        var MaxThiefParts = 70;
        var MaxMeleeParts = 70;
        var MaxRangedParts = 70;
        var MaxHealerParts = 10;
        var MaxHarvesterCount = myRoom.memory.hasLinks || myRoom.memory.hasContainers ? 4 : 5;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        var MaxWorkerCount = myRoom.memory.marshalForce ? 1 : 4;
        var MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        var MaxUpgraderCount = myRoom.memory.hasLinks ? 2 : 1;
        var MaxThiefCount = myRoom.memory.marshalForce ? 0 : 8;
        var MaxMeleeCount = myRoom.memory.marshalForce ? Memory.attackers.forceSize - 3 : 0;
        var MaxRangedCount = myRoom.memory.marshalForce ? 2 : 0;
        var MaxHealerCount = myRoom.memory.marshalForce ? 1 : 0;
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
                if (myCreepCount.harvester < 1) //just in case, if there are no harvesters spawn a harvester
                    {
                        Spawn.spawnCreep([WORK, CARRY, MOVE], 'Harvester', {
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
                if (myCreepCount.harvesterParts < MaxHarvesterParts && myCreepCount.harvesterCount < MaxHarvesterCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Harvester' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, { 'harvester': true }), newName, {
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
                if (myCreepCount.workerParts < MaxWorkerParts && myCreepCount.workerCount < MaxWorkerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Worker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'worker'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.upgraderParts < MaxUpgraderParts && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'upgrader'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.muleParts < MaxMuleParts && myCreepCount.muleCount < MaxMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Mule' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, { 'carryOnly': true }), newName, {
                        memory: {
                            'role': 'mule'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.thiefParts < MaxThiefParts && Memory.misc.globalCreeps.thief < MaxThiefCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Thief' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom), newName, {
                        memory: {
                            'role': 'thief',
                            'secondaryRole': totalCreeps > 15 ? 'upgrader' : 'harvester'
                        }
                    });
                    console.log('Spawning: ' + newName);
                }
                if (myCreepCount.meleeParts < MaxMeleeParts && Memory.misc.globalCreeps.melee < MaxMeleeCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Melee' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, { 'melee': true }), newName, {
                        memory: {
                            'role': 'melee'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.healerParts < MaxHealerParts && Memory.misc.globalCreeps.healer < MaxHealerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Healer' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, { 'healer': true }), newName, {
                        memory: {
                            'role': 'healer'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.rangedParts < MaxRangedParts && Memory.misc.globalCreeps.ranged < MaxRangedCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Ranged' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, { 'ranged': true }), newName, {
                        memory: {
                            'role': 'ranged'
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

function getBody(myRoom, options = {}) {
    var totalEnergy = Math.floor((myRoom.energyCapacityAvailable - 100) / 50);
    var referenceEnergy = Math.floor(totalEnergy / 4) * 4 * 50;
    var partArray = [];

    if (options.melee) {
        for (var i = 0; i < Math.floor(referenceEnergy / 130); i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.healer) {
        for (var i = 0; i < Math.floor(referenceEnergy / 300); i += 1) {
            partArray.push(HEAL);
            partArray.push(MOVE);
        }
        return partArray;
    }
    if (options.ranged) {
        for (var i = 0; i < Math.floor(referenceEnergy / 200); i += 1) {
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
        while (totalEnergy >= 4 && workCount < 8) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < 7) {
                partArray.push(WORK);
                partArray.push(WORK);
                workCount += 2;
                totalEnergy -= 4;
            }
        }
        return partArray;
    }
    if (options.harvester) {
        while (totalEnergy >= 4 && workCount < 8) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
        }
        return partArray;
    }
    while (totalEnergy >= 4) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            totalEnergy -= 2;
        }
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 2;
    }
    return partArray;
}

/* harmony default export */ __webpack_exports__["a"] = (spawner);

/***/ })
/******/ ]);