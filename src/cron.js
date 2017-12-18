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
                brains.buildRequest(key, 1, {
                    'role': 'reserve',
                    'myTask': 'goToTarget',
                    'reserveTarget': key,
                    'goToTarget': key,
                    'name': newName,
                });
                Memory.reservers[key] = newName;
                console.log('Build req '+ newName);
            }
        });

        // Defcon

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
                        brains.updateSquadSize(roomName + 'defcon', myRoom.memory.defcon);
                    }
                } else if (myRoom.memory.defcon > 0) {
                    brains.createSquad(roomName + 'defcon', roomName, myRoom.memory.defcon, 'defcon');
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
        Memory.possibleTargets = [
            'W37N35', 'W37N33', 'W38N34', 'W38N35', 'W38N33', // W37N34
            'W39N35', 'W39N37', 'W38N36', 'W39N34', 'W38N37', // W39N36
            'W38N32', 'W38N31', 'W37N32', 'W36N31', 'W36N32', // W37N31
        ];
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
            '5982fc75b097071b4adbd79a': 0,
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
            '5982fc75b097071b4adbd79a': 0,
        }
        if (!Memory.thieving_mules) {
            Memory.thieving_mules = {};
        }
        Object.keys(thieving_mules).forEach((key) => {
            if (!Memory.thieving_mules[key]) {
                Memory.thieving_mules[key] = 0;
            }
        })

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
            'W37N32': 0,
            // 'W36N31': 0, This has only one energy. Not worth the build time
            // 'W36N32': 0, This guy is too far
        }

        if (!Memory.reservers) {
            Memory.reservers = {};
        }
        Object.keys(resevers).forEach((key) => {
            if (!Memory.reservers[key]) {
                Memory.reservers[key] = 0;
            }
        })

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
            '5982fc5db097071b4adbd43e': 'W36N37',
            '5982fc5db097071b4adbd43c': 'W36N37',
            // location: W36N38
            '5982fc68b097071b4adbd592': 'W36N37',
            '5982fc68b097071b4adbd593': 'W36N37',
            // location: W35N38
            '5982fc74b097071b4adbd779': 'W36N37',
            '5982fc74b097071b4adbd77a': 'W36N37',
            // FOR W35N33
            // location: W36N33
            '5982fc69b097071b4adbd5b6': 'W35N33',
            // location: W35N32
            '5982fc75b097071b4adbd79a': 'W35N33',
        }

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
            '5982fc75b097071b4adbd79a': 1500,
        }

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
            'W36N32': 'W37N31',
            'W37N37': 'W36N37',
            'W36N38': 'W36N37',
            'W35N38': 'W36N37',
            'W36N33': 'W35N33',
            'W35N32': 'W35N33',
        }
    },
}

export default cronJobs;
