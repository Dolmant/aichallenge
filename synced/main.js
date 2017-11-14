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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const actHarvest = {
    run: function (creep) {
        if (!creep.memory.sourceMap && !creep.memory.tempSourceMap) {
            getSource(creep);
        }
        if (!creep.carryCapacity || creep.carry.energy == creep.carryCapacity) {
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
            if (container.length > 0) {
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
/* 1 */
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
            return true;
        } else {
            creep.moveTo(creep.pos.findClosestByRange(creep.room.findExitTo(creep.memory.goToTarget)), { 'maxRooms': 1 });
        }
    },
    moveToTarget(creep) {
        if (creep.pos.getRangeTo(creep.memory.moveToTargetx, creep.memory.moveToTargety) <= creep.memory.moveToTargetrange || !creep.memory.moveToTargetx) {
            delete creep.memory.moveToTargetx;
            delete creep.memory.moveToTargety;
            delete creep.memory.moveToTargetrange;
            return true;
        } else {
            var err = creep.moveTo(creep.memory.moveToTargetx, creep.memory.moveToTargety, { 'maxRooms': 1 });
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.moveToTargetx;
                delete creep.memory.moveToTargety;
                delete creep.memory.moveToTargetrange;
                return true;
            }
        }
    },
    moveToObject(creep) {
        if (!Game.getObjectById(creep.memory.moveToObject)) {
            return true;
        }
        if (creep.pos.getRangeTo(Game.getObjectById(creep.memory.moveToObject).pos) <= creep.memory.moveToObjectRange) {
            delete creep.memory.moveToObject;
            delete creep.memory.moveToObjectRange;
            return true;
        } else {
            var err = creep.moveTo(Game.getObjectById(creep.memory.moveToObject));
            if (err == ERR_NO_PATH || err == ERR_INVALID_TARGET) {
                delete creep.memory.moveToObject;
                delete creep.memory.moveToObjectRange;
                return true;
            }
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (util);

/***/ }),
/* 2 */
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
/* 3 */
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
                creep.moveTo(target, { 'maxRooms': 1 });
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
            if (creep.carry.energy == 0) {
                return true;
            }
            if (lazyContainer) {
                var err;
                if (lazyContainer.hits < lazyContainer.hitsMax / 2) {
                    err = creep.repair(lazyContainer);
                    if (err == ERR_NOT_ENOUGH_RESOURCES) {
                        return true;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lazyContainer.pos, { 'maxRooms': 1 });
                    } else {
                        return true;
                    }
                } else {
                    err = creep.transfer(lazyContainer, RESOURCE_ENERGY);
                    if (err == ERR_FULL || err == ERR_INVALID_ARGS || err == ERR_NOT_ENOUGH_RESOURCES) {
                        creep.drop(RESOURCE_ENERGY);
                        return true;
                    } else if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(lazyContainer.pos, { 'maxRooms': 1 });
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
                creep.moveTo(target, { 'maxRooms': 1 });
            }
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actDeposit);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleThief = {
    run(creep) {
        if (creep.memory.myTask == 'lazydeposit' && creep.memory.myBuildTarget) {
            creep.memory.myTask = 'build';
        } else if (creep.carry.energy < creep.carryCapacity) {
            if (creep.memory.myTask == 'harvest') {
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
        if (global.thieving_spots) {
            const targets = Object.keys(global.thieving_spots);
            for (var i = 0; i < targets.length; i += 1) {
                if (global.thieving_spots[targets[i]] == 0) {
                    return targets[i];
                }
            }
        } else {
            console.log('no thief object, failed');
            return '59bbc4262052a716c3ce7711';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThief);

/***/ }),
/* 5 */
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
        } else if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name == creep.memory.stealTarget) {
            creep.memory.myTask = 'fetch';
        } else if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name != creep.memory.home) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.home;
        } else if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name != creep.memory.stealTarget) {
            creep.memory.myTask = 'goToTarget';
            creep.memory.goToTarget = creep.memory.stealTarget;
        } else if (creep.carryCapacity == _.sum(creep.carry) && creep.room.name == creep.memory.home) {
            creep.memory.myTask = 'deposit';
        }
    },
    generateHaulTargets() {
        const possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52', 'W45N51', 'W46N53'];
        const homeArray = ['W43N53', 'W41N51', 'W41N51', 'W43N53', 'W43N53', 'W41N51', 'W45N53', 'W45N53', 'W45N53'];

        if (possibleTargets.length <= Memory.muleFlag) {
            Memory.muleFlag = 1;
        } else {
            Memory.muleFlag += 1;
        }
        return [possibleTargets[Memory.muleFlag - 1], homeArray[Memory.muleFlag - 1]];
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleThiefMule);

/***/ }),
/* 6 */
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
                delete creep.memory.healCreep;
                return true;
            }
        } else {
            delete creep.memory.healCreep;
            return true;
        }
    },
    attack: function (creep) {
        var target = Game.getObjectById(creep.memory.attackCreep);
        if (target) {
            var err = creep.attack(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            } else if (err == ERR_INVALID_TARGET) {
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
                creep.moveTo(target.pos);
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
            creep.moveTo(Game.flags['Attack'].pos);
            return true;
        } else {
            if (creep.pos.getRangeTo(Game.flags['Marshal'].pos) <= 2) {
                return true;
            } else {
                creep.moveTo(Game.flags['Marshal'].pos);
            }
        }
    },
    renew: function (creep, mySpawns) {
        var inRange = creep.pos.getRangeTo(mySpawns[0].pos) <= 1;
        if (creep.ticksToLive > 1400 || Memory.attackers.attacking) {
            return true;
        }
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
        creep.memory.myTask = target.id;
    } else {
        delete creep.memory.attackCreep;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (actOffensive);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["loop"] = loop;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__room__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__cron__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__screeps_profiler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__screeps_profiler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__screeps_profiler__);



// docs:
/*
place a flag names 'Attack' to designate the attack room and location
place a flag names 'Marshal' to designate a staging area.
To specify size, change forceSize on the Memory.attackers object
To tell a room to marshal a force, change the room flag 'marshalForce' to true
You can send a worker to another room by specifying the roomname on goToTarget and change their task name to goToTarget (make this global)

You can claim by placing a Claim flag setting myRoom.memory.spawnClaimer to the number of claimers you want
*/

__WEBPACK_IMPORTED_MODULE_2__screeps_profiler__["enable"]();

function loop() {
    __WEBPACK_IMPORTED_MODULE_2__screeps_profiler__["wrap"](function () {
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
        __WEBPACK_IMPORTED_MODULE_1__cron__["a" /* default */].run();
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
        var spawns = Game.spawns;
        for (let roomKey in rooms) {
            let room = Game.rooms[roomKey];
            var isMyRoom = room.controller ? room.controller.my : 0;
            if (isMyRoom) {
                Memory.stats['room.' + room.name + '.myRoom'] = 1;
                Memory.stats['room.' + room.name + '.energyAvailable'] = room.energyAvailable;
                Memory.stats['room.' + room.name + '.energyCapacityAvailable'] = room.energyCapacityAvailable;
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
        // for (let spawnKey in spawns) {
        //     let spawn = Game.spawns[spawnKey];
        //     Memory.stats['spawn.' + spawn.name + '.defenderIndex'] = spawn.memory['defenderIndex'];
        // }

        // Memory.stats['cpu.CreepManagers'] = creepManagement;
        // Memory.stats['cpu.Towers'] = towersRunning;
        // Memory.stats['cpu.Links'] = linksRunning;
        // Memory.stats['cpu.SetupRoles'] = roleSetup;
        // Memory.stats['cpu.Creeps'] = functionsExecutedFromCreeps;
        // Memory.stats['cpu.SumProfiling'] = sumOfProfiller;
        // Memory.stats['cpu.Start'] = startOfMain;
        Memory.stats['cpu.bucket'] = Game.cpu.bucket;
        Memory.stats['cpu.limit'] = Game.cpu.limit;
        // Memory.stats['cpu.stats'] = Game.cpu.getUsed() - lastTick;
        Memory.stats['cpu.getUsed'] = Game.cpu.getUsed();

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
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__screeps_profiler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__roles_role_upgrader__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__roles_role_harvester__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__roles_role_mule__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__roles_role_worker__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__roles_role_claimer__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__roles_role_thief__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__roles_role_thiefmule__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__roles_role_offensive__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__spawner__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__task_manager__ = __webpack_require__(16);















__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_1__roles_role_upgrader__["a" /* default */], 'upgrader');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_2__roles_role_harvester__["a" /* default */], 'harvester');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_3__roles_role_mule__["a" /* default */], 'mule');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_4__roles_role_worker__["a" /* default */], 'worker');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_5__roles_role_claimer__["a" /* default */], 'claimer');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_6__roles_role_thief__["a" /* default */], 'thief');
__WEBPACK_IMPORTED_MODULE_0__screeps_profiler__["registerObject"](__WEBPACK_IMPORTED_MODULE_8__roles_role_offensive__["a" /* default */], 'run');

const RoomController = {
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
                case 'thief':
                    myCreepCount.thiefParts += creep_size;
                    Memory.misc.globalCreepsTemp.thief += 1;
                    if (global.register_thieves) {
                        global.thieving_spots[creep.memory.sourceMap || creep.memory.tempSourceMap] = creep.name;
                    }
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

        let convert = null;
        myCreeps.forEach(creep => {
            if (__WEBPACK_IMPORTED_MODULE_10__task_manager__["a" /* default */].run(creep, mySpawns)) {
                switch (creep.memory.role) {
                    default:
                    case 'harvester':
                        __WEBPACK_IMPORTED_MODULE_2__roles_role_harvester__["a" /* default */].run(creep);
                        break;
                    case 'harvesterExtractor':
                        __WEBPACK_IMPORTED_MODULE_2__roles_role_harvester__["a" /* default */].runExtractor(creep);
                        break;
                    case 'upgrader':
                        __WEBPACK_IMPORTED_MODULE_1__roles_role_upgrader__["a" /* default */].run(creep);
                        break;
                    case 'worker':
                        if (myCreepCount.harvesterCount < 2) {
                            convert = creep;
                        }
                        __WEBPACK_IMPORTED_MODULE_4__roles_role_worker__["a" /* default */].run(creep);
                        break;
                    case 'mule':
                        __WEBPACK_IMPORTED_MODULE_3__roles_role_mule__["a" /* default */].run(creep);
                        break;
                    case 'claimer':
                        __WEBPACK_IMPORTED_MODULE_5__roles_role_claimer__["a" /* default */].run(creep);
                        break;
                    case 'thief':
                        __WEBPACK_IMPORTED_MODULE_6__roles_role_thief__["a" /* default */].run(creep);
                        break;
                    case 'thiefmule':
                        __WEBPACK_IMPORTED_MODULE_7__roles_role_thiefmule__["a" /* default */].run(creep);
                        break;
                    case 'melee':
                    case 'ranged':
                    case 'healer':
                    case 'blocker':
                    case 'tough':
                        __WEBPACK_IMPORTED_MODULE_8__roles_role_offensive__["a" /* default */].run(creep, mySpawns);
                        break;
                }
            }
        });

        // if (myRoom.find(FIND_HOSTILE_CREEPS).length > 0 && !myRoom.controller.safeMode && !myRoom.controller.safeModeCooldown && myRoom.controller.safeModeAvailable) {
        //     // myRoom.controller.activateSafeMode();
        //     // dont waste these!!
        // }

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
        var minRepair = 100000;
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
    myRoom.memory.runUpdate = false;
    myRoom.memory.spawnClaimer = 0;
    myRoom.memory.sources = myRoom.find(FIND_SOURCES).map(source => source.id);
}

function updateRoomConsts(myRoom, mySpawns) {
    if (Memory.methods.createRemoteWorkers) {
        Memory.methods.createRemoteWorkers -= 1;
        Memory.misc.requests.push({
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
/* 9 */
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_action_harvest__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_deposit__ = __webpack_require__(3);



const roleHarvester = {
    run: function (creep) {
        // TODO FIX THIS BS OR ASSUME YOU WILL ALWAYS BE CALLED AFTER
        if (creep.memory.moveToTargetx) {
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
        if (creep.memory.moveToTargetx) {
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
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleMule = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }
        if (_.sum(creep.carry) < creep.carryCapacity) {
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
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const roleWorker = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (creep.memory.myTask != 'resupply') {
            if (creep.carry.energy == 0) {
                creep.memory.myTask = 'resupply';
            } else if (creep.memory.myBuildTarget) {
                creep.memory.myTask = 'resupply';
            } else {
                creep.memory.myTask = 'upgrade';
            }
        }
        if (creep.memory.myTask == 'resupply' && creep.carry.energy == creep.carryCapacity) {
            creep.memory.myTask = 'build';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleWorker);

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);


const roleClaimer = {
    run: function (creep) {
        if (creep.fatigue != 0) {
            return;
        }

        if (!Game.flags['Claim']) {
            console.log('Please define the claim flag target');
            creep.memory.myTask = '';
        } else {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            creep.memory.myTask = 'goToTarget';
        }
    }
};

/* harmony default export */ __webpack_exports__["a"] = (roleClaimer);

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__ = __webpack_require__(6);



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
                    __WEBPACK_IMPORTED_MODULE_1__actions_action_offensive__["a" /* default */].findTarget(creep);
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
                if (creep.ticksToLive < 1000) {
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
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__roles_role_thief__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__roles_role_thiefmule__ = __webpack_require__(5);



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
        var MaxHarvesterCount = myRoom.memory.hasLinks || myRoom.memory.hasContainers ? 2 : 4;
        var MaxHarvesterExtractorCount = myRoom.memory.hasContainers && myRoom.memory.hasExtractor ? 1 : 0;
        // implement levels
        // var MinHarvesterCount = (myRoom.memory.hasLinks || myRoom.memory.hasContainers) ? 4 : 5;
        var MaxWorkerCount = myRoom.memory.marshalForce ? 1 : 2;
        var MaxMuleCount = myRoom.memory.hasContainers ? 2 : 0;
        MaxMuleCount = myRoom.memory.hasExtractor ? 3 : MaxMuleCount;
        var MaxUpgraderCount = myRoom.memory.hasLinks ? 0 : 0;
        var MaxThiefCount = myRoom.memory.marshalForce ? 0 : 13;
        var MaxThiefMuleCount = 9;
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
                            'myTask': 'harvest',
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
                            'role': 'claimer',
                            'myTask': null //generate a target from the claimer role
                        }
                    });
                    console.log('Spawning: ' + newName);
                    myRoom.memory.spawnClaimer -= 1;
                    canSpawn = false;
                }
                if (myCreepCount.workerParts < MaxParts.worker * MaxWorkerCount && myCreepCount.workerCount < MaxWorkerCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Worker' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.worker, { 'worker': true }), newName, {
                        memory: {
                            'role': 'worker',
                            'myTask': 'resupply'
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
                            'role': 'mule',
                            'myTask': 'fetch'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.upgraderParts < MaxUpgraderCount && myCreepCount.upgraderCount < MaxUpgraderCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Upgrader' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.upgrader), newName, {
                        memory: {
                            'role': 'upgrader',
                            'myTask': 'resupply'
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
                            'myTask': 'harvestMinerals'
                        }
                    });
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.thiefParts < MaxParts.thief * MaxThiefCount && Memory.misc.globalCreeps.thief < MaxThiefCount && Memory.misc.globalCreeps.thiefmule > Memory.misc.globalCreeps.thief / 2 && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Thief' + Game.time;
                    var target = __WEBPACK_IMPORTED_MODULE_0__roles_role_thief__["a" /* default */].generateStealTarget();
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.thief, { 'thief': true }), newName, {
                        memory: {
                            'role': 'thief',
                            'sourceMap': target,
                            'myTask': 'moveToObject',
                            'moveToObject': target,
                            'moveToObjectRange': 1
                        }
                    });
                    Memory.misc.globalCreeps.thief += 1;
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (Memory.misc.globalCreeps.thiefmule < MaxThiefMuleCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'ThiefMule' + Game.time;
                    var targets = __WEBPACK_IMPORTED_MODULE_1__roles_role_thiefmule__["a" /* default */].generateHaulTargets();
                    var target_room = targets[0];
                    var home = targets[1];
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.mule, { 'carryOnly': true }), newName, {
                        memory: {
                            'role': 'thiefmule',
                            'myTask': 'goToTarget',
                            'goToTarget': target_room,
                            'stealTarget': target_room,
                            'home': home
                        }
                    });
                    Memory.misc.globalCreeps.thiefmule += 1;
                    console.log('Spawning: ' + newName);
                    canSpawn = false;
                }
                if (myCreepCount.meleeParts < MaxParts.melee * MaxMeleeCount && Memory.misc.globalCreeps.melee < MaxMeleeCount && myRoom.energyAvailable >= referenceEnergy && canSpawn) {
                    var newName = 'Melee' + Game.time;
                    Spawn.spawnCreep(getBody(myRoom, MaxParts.melee, { 'melee': true }), newName, {
                        memory: {
                            'role': 'melee',
                            'myTask': 'gather'
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
        Spawn.spawnCreep(getBody(myRoom, 10), newName, {
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
        for (var i = 0; totalEnergy >= 3 && i < MaxParts; i += 1) {
            partArray.push(ATTACK);
            partArray.push(MOVE);
            totalEnergy -= 3;
        }
        return partArray;
    }
    if (options.healer) {
        for (var i = 0; totalEnergy >= 6 && i < MaxParts; i += 1) {
            partArray.push(HEAL);
            partArray.push(MOVE);
            totalEnergy -= 6;
        }
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
    if (options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers) {
        while (totalEnergy >= 3 && workCount < MaxParts) {
            partArray.push(WORK);
            partArray.push(MOVE);
            totalEnergy -= 3;
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
    if (options.thief) {
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount += 1;
        while (totalEnergy >= 3 && workCount < MaxParts) {
            partArray.push(WORK);
            partArray.push(MOVE);
            totalEnergy -= 3;
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
    if (options.worker) {
        while (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK);
            partArray.push(MOVE);
            partArray.push(CARRY);
            totalEnergy -= 4;
            workCount += 1;
            if (totalEnergy >= 4 && workCount < MaxParts) {
                partArray.push(WORK);
                totalEnergy -= 2;
                workCount += 1;
            }
        }
        return partArray;
    }
    while (totalEnergy >= 4 && workCount < MaxParts) {
        if (!options.carryOnly) {
            partArray.push(WORK);
            partArray.push(CARRY);
            totalEnergy -= 1;
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
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions_action_deposit__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__actions_action_resupply__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__actions_action_harvest__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__actions_action_upgrade__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__actions_action_build__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__util__ = __webpack_require__(1);










/**
* Runs the current state and returns the state machine results. A return of true means we need to assign a new task.
*/

const taskManager = {
    run: function (creep, mySpawns) {
        switch (creep.memory.myTask) {
            case 'claim':
                return __WEBPACK_IMPORTED_MODULE_2__actions_action_claim__["a" /* default */].run(creep);
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
            case 'upgrade':
                return __WEBPACK_IMPORTED_MODULE_4__actions_action_upgrade__["a" /* default */].run(creep);
            case 'resupply':
                return __WEBPACK_IMPORTED_MODULE_1__actions_action_resupply__["a" /* default */].run(creep);
            case 'repair':
            case 'build':
                return __WEBPACK_IMPORTED_MODULE_5__actions_action_build__["a" /* default */].run(creep);
            case 'heal':
                return __WEBPACK_IMPORTED_MODULE_6__actions_action_offensive__["a" /* default */].heal(creep);
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
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__action_harvest__ = __webpack_require__(0);


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
            if (err == OK || err == ERR_NOT_ENOUGH_RESOURCES) {
                delete creep.memory.resupplyTarget;
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
        if (_.sum(creep.carry) == creep.carryCapacity) {
            delete creep.memory.dropTarget;
            delete creep.memory.fetchTarget;
            return true;
        }
        var target;
        if (creep.memory.dropTarget) {
            target = Game.getObjectById(creep.memory.dropTarget);
            var err = target && creep.pickup(target);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { 'maxRooms': 1 });
            } else if (err == OK) {
                delete creep.memory.dropTarget;
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
            } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                var resources = Object.keys(target.store);
                // first one is usually energy due to alphbetical order TODO fix this to be error free
                err = creep.withdraw(target, resources[1]);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { 'maxRooms': 1 });
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
    var target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
        creep.memory.dropTarget = target.id;
        delete creep.memory.fetchTarget;
    } else {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) >= creep.carryCapacity / 2;
            }
        });
        if (target) {
            creep.memory.fetchTarget = target.id;
            delete creep.memory.dropTarget;
        } else {
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_STORAGE && _.sum(structure.store) >= creep.carryCapacity / 2;
                }
            });
            if (target) {
                creep.memory.fetchTarget = target.id;
                delete creep.memory.dropTarget;
            } else {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) && _.sum(structure.store) > 0;
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
    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
            return (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_LINK) && (structure.energy > 0 || structure.storeCapacity && structure.store.energy >= creep.carryCapacity);
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
                creep.moveTo(Game.flags['Claim'].pos, { 'maxRooms': 1 });
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                creep.reserveController(creep.room.controller);
                creep.moveTo(Game.flags['Claim'].pos, { 'maxRooms': 1 });
            }
        } else {
            creep.memory.goToTarget = Game.flags['Claim'].pos.roomName;
            return true;
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
        if (creep.carry.energy == 0) {
            // expect state to return to fetch/resupply
            return true;
        }
        let myUpgrade = Game.getObjectById(creep.memory.MyController);
        if (creep.upgradeController(myUpgrade) == ERR_NOT_IN_RANGE) {
            creep.moveTo(myUpgrade, { 'maxRooms': 1 });
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
                var err = creep.build(target);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { 'maxRooms': 1 });
                } else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    // expect state change to resupply
                    return true;
                }
                if (!target) {
                    findBuildTarget(creep);
                }
            } else if (creep.memory.myRepairTarget) {
                target: Structure = Game.getObjectById(creep.memory.myRepairTarget);
                var err = creep.repair(target);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { 'maxRooms': 1 });
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const cronJobs = {
    run() {
        if (!Memory.cronCount) {
            Memory.cronCount = 0;
        }
        Memory.cronCount += 1;
        if (global.thieving_spots) {
            global.register_thieves = false;
            if (Memory.cronCount > 10) {
                Memory.cronCount -= 10;
                cronJobs.run10();
            }
        } else {
            cronJobs.init();
        }
    },
    run10() {
        const checker = 4;
        Object.keys(global.thieving_spots).forEach(key => {
            if (global.thieving_spots[key] && !Game.creeps[global.thieving_spots[key]]) {
                global.thieving_spots[key] = 0;
            }
        });
    },
    init() {
        global.thieving_spots = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 0,
            '59bbc4262052a716c3ce7712': 0,
            // location: W45N52
            '59bbc4282052a716c3ce7771': 0,
            '59bbc4282052a716c3ce7772': 0,
            // location: W46N51
            '59bbc4282052a716c3ce7776': 0,
            '59bbc4282052a716c3ce7777': 0,
            // location: W44N53
            '59bbc42a2052a716c3ce77ce': 0,
            // location: W44N52
            '59bbc42b2052a716c3ce77d0': 0,
            // location: W44N51
            '59bbc42b2052a716c3ce77d3': 0,
            // location: W43N52
            '59bbc42d2052a716c3ce7822': 0,
            // location: W43N51
            '59bbc42d2052a716c3ce7824': 0,
            '59bbc42d2052a716c3ce7825': 0,
            // location: W42N51
            '59bbc4302052a716c3ce7862': 0
        };
        global.register_thieves = true;
    }
};

/* harmony default export */ __webpack_exports__["a"] = (cronJobs);

/***/ })
/******/ ]);