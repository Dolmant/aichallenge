import brains from './brains';

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
            brains.createSquad(Memory.squad_requests[0].squad, Memory.squad_requests[0].roomTarget, Memory.squad_requests[0].size, Memory.squad_requests[0].role);
            Memory.squad_requests.splice(0, 1);
        }
    },
    run10() {
        Object.keys(Memory.thieving_spots).forEach(key => {
            if (Memory.thieving_spots[key] && !Game.creeps[Memory.thieving_spots[key]] && !Memory.buildQueue.includes('Thief' + key)) {
                Memory.thieving_spots[key] = 0;
            }
            if (Memory.thieving_spots[key] == 0) {
                var newName = 'Thief' + key;
                var target_room = Memory.roomMap[key];
                Memory.buildQueue.push(newName);
                brains.buildRequest(target_room, 1, {
                    'role': 'thief',
                    'sourceMap': key,
                    'myTask': 'moveToObject',
                    'moveToObject': key,
                    'moveToObjectRange': 1,
                    'name': newName,
                });
                Memory.thieving_spots[key] = newName;
                console.log('Build req: '+ newName);
            }
        });
        Object.keys(Memory.thieving_mules).forEach(key => {
            if (Memory.thieving_mules[key] && !Game.creeps[Memory.thieving_mules[key]] && !Memory.buildQueue.includes('ThiefMule' + key)) {
                Memory.thieving_mules[key] = 0;
            }
            if (Memory.thieving_mules[key] == 0) {
                var newName = 'ThiefMule' + key;
                var target_room = Memory.roomMap[key];
                var home = Memory.homeMap[Memory.roomMap[key]];
                Memory.buildQueue.push(newName);
                brains.buildRequest(target_room, 1, {
                    'role': 'thiefmule',
                    'myTask': 'goToTarget',
                    'sourceMap': key,
                    'goToTarget': target_room,
                    'stealTarget': target_room,
                    'home': home,
                    'name': newName,
                    'preTask': 'roadWorker',
                });
                Memory.thieving_mules[key] = newName;
                console.log('Build req '+ newName);
            }
        });

        const myOwnedRooms = ['W43N53', 'W45N53', 'W41N51', 'W46N52'];
        const myRooms = myOwnedRooms.concat(Memory.possibleTargets);

        myRooms.forEach(roomName => {
            let myRoom = Game.rooms[roomName]
            if (myRoom) {
                var enemyCreeps: Creep = myRoom.find(FIND_HOSTILE_CREEPS);
                myRoom.memory.defcon = enemyCreeps.length;
                if (enemyCreeps.length > 0 && myOwnedRooms.includes(roomName)) {
                    myRoom.memory.defcon -= 1;
                }
                if (Memory.squads[roomName + 'defcon']) {
                    if (Memory.squads[roomName + 'defcon'].size != myRoom.memory.defcon && Memory.squads[roomName + 'defcon'].role != 'retired') {
                        // brains.updateSquadSize(roomName + 'defcon', myRoom.memory.defcon);
                    }
                } else if (myRoom.memory.defcon > 0) {
                    // brains.createSquad(roomName + 'defcon', roomName, myRoom.memory.defcon, 'defcon');
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
        Memory.possibleTargets = ['W37N35', 'W37N33', 'W38N34', 'W38N35', 'W38N33'];
        const thieving_spots = {
            // // location: W37N35
            '5982fc5db097071b4adbd444': 0,
            '5982fc5db097071b4adbd443': 0,
            // // location: W37N33
            '5982fc5db097071b4adbd44b': 0,
            // // location: W38N34
            '5982fc51b097071b4adbd2f9': 0,
            // // location: W38N35
            '5982fc51b097071b4adbd2f7': 0,
            // // location: W38N33
            '5982fc51b097071b4adbd2fc': 0,
            '5982fc51b097071b4adbd2fd': 0,
        }
        if (!Memory.thieving_spots) {
            Memory.thieving_spots = {};
        }
        Object.keys(thieving_spots).forEach((key) => {
            if (!Memory.thieving_spots[key]) {
                Memory.thieving_spots[key] = 0;
            }
        })

        const thieving_mules = {
            // // location: W37N35
            '5982fc5db097071b4adbd444': 0,
            '5982fc5db097071b4adbd443': 0,
            // // location: W37N33
            '5982fc5db097071b4adbd44b': 0,
            // // location: W38N34
            '5982fc51b097071b4adbd2f9': 0,
            // // location: W38N35
            '5982fc51b097071b4adbd2f7': 0,
            // // location: W38N33
            '5982fc51b097071b4adbd2fc': 0,
            '5982fc51b097071b4adbd2fd': 0,
        }
        if (!Memory.thieving_mules) {
            Memory.thieving_mules = {};
        }
        Object.keys(thieving_mules).forEach((key) => {
            if (!Memory.thieving_mules[key]) {
                Memory.thieving_mules[key] = 0;
            }
        })

        Memory.roomMap = {
            // // location: W37N35
            '5982fc5db097071b4adbd444': 'W37N35',
            '5982fc5db097071b4adbd443': 'W37N35',
            // // location: W37N33
            '5982fc5db097071b4adbd44b': 'W37N33',
            // // location: W38N34
            '5982fc51b097071b4adbd2f9': 'W38N34',
            // // location: W38N35
            '5982fc51b097071b4adbd2f7': 'W38N35',
            // // location: W38N33
            '5982fc51b097071b4adbd2fc': 'W38N33',
            '5982fc51b097071b4adbd2fd': 'W38N33',
        }

        Memory.energyMap = {
            // // location: W37N35
            '5982fc5db097071b4adbd444': 1500,
            '5982fc5db097071b4adbd443': 1500,
            // // location: W37N33
            '5982fc5db097071b4adbd44b': 1500,
            // // location: W38N34
            '5982fc51b097071b4adbd2f9': 1500,
            // // location: W38N35
            '5982fc51b097071b4adbd2f7': 1500,
            // // location: W38N33
            '5982fc51b097071b4adbd2fc': 1500,
            '5982fc51b097071b4adbd2fd': 1500,
        }

        Memory.homeMap = {
            'W37N35': 'W37N34',
            'W37N33': 'W37N34',
            'W38N34': 'W37N34',
            'W38N35': 'W37N34',
            'W38N33': 'W37N34',
        }
    },
}

export default cronJobs;
