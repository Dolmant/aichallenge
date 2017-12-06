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
        Memory.possibleTargets = ['W43N52', 'W42N51', 'W44N51', 'W44N52', 'W44N53', 'W43N51', 'W45N52', 'W45N51', 'W46N53', 'W47N52', 'W46N51', 'W45N55', 'W43N54'];
        const thief_spots = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 0,
            '59bbc4262052a716c3ce7712': 0,
            // location: W45N52
            '59bbc4282052a716c3ce7771': 0,
            '59bbc4282052a716c3ce7772': 0,
            // location: W45N51
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
            '59bbc4302052a716c3ce7862': 0,
            // location: W46N51
            '59bbc4262052a716c3ce7717': 0,
            '59bbc4262052a716c3ce7718': 0,
            // location: W47N52
            '59bbc4242052a716c3ce76bf': 0,
            '59bbc4242052a716c3ce76c1': 0,
            // location W45N54
            '59bbc4282052a716c3ce7768': 0,
            '59bbc4282052a716c3ce7766': 0,
            '59bbc4282052a716c3ce7767': 0,
            // location W44N54
            '59bbc42a2052a716c3ce77ca': 0,
            '59bbc42a2052a716c3ce77c8': 0,
            '59bbc42a2052a716c3ce77c7': 0,
            // location W45N55
            '59bbc4282052a716c3ce7762': 0,
            '59bbc4282052a716c3ce7761': 0,
            '59bbc4282052a716c3ce7760': 0,
            // location W43N54
            '59bbc42d2052a716c3ce781b': 0,
            '59bbc42d2052a716c3ce7819': 0,
        }
        // if (!Memory.thieving_spots) {
        //     Memory.thieving_spots = {};
        // }
        Object.keys(thief_spots).forEach((key) => {
            if (!Memory.thieving_spots[key]) {
                Memory.thieving_spots[key] = 0;
            }
        })

        const thieving_mules = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 0,
            '59bbc4262052a716c3ce7712': 0,
            // location: W45N52
            '59bbc4282052a716c3ce7771': 0,
            '59bbc4282052a716c3ce7772': 0,
            // location: W45N51
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
            '59bbc4302052a716c3ce7862': 0,
            // location: W46N51
            '59bbc4262052a716c3ce7717': 0,
            '59bbc4262052a716c3ce7718': 0,
            // location: W47N52
            '59bbc4242052a716c3ce76bf': 0,
            '59bbc4242052a716c3ce76c1': 0,
            // location W45N54
            '59bbc4282052a716c3ce7768': 0,
            '59bbc4282052a716c3ce7766': 0,
            '59bbc4282052a716c3ce7767': 0,
            'W45N541': 0,
            'W45N542': 0,
            // location W44N54 plus extras
            '59bbc42a2052a716c3ce77ca': 0,
            '59bbc42a2052a716c3ce77c8': 0,
            '59bbc42a2052a716c3ce77c7': 0,
            'W44N541': 0,
            'W44N542': 0,
            // location W45N55 plus extras
            '59bbc4282052a716c3ce7762': 0,
            '59bbc4282052a716c3ce7761': 0,
            '59bbc4282052a716c3ce7760': 0,
            'W45N551': 0,
            'W45N552': 0,
            'W45N553': 0,
            'W45N554': 0,
            // location W43N54
            '59bbc42d2052a716c3ce781b': 0,
            '59bbc42d2052a716c3ce7819': 0,
        }
        // if (!Memory.thieving_mules) {
        //     Memory.thieving_mules = {};
        // }
        Object.keys(thieving_mules).forEach((key) => {
            if (!Memory.thieving_mules[key]) {
                Memory.thieving_mules[key] = 0;
            }
        })

        Memory.roomMap = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 'W46N53',
            '59bbc4262052a716c3ce7712': 'W46N53',
            // location: W45N52
            '59bbc4282052a716c3ce7771': 'W45N52',
            '59bbc4282052a716c3ce7772': 'W45N52',
            // location: W45N51
            '59bbc4282052a716c3ce7776': 'W45N51',
            '59bbc4282052a716c3ce7777': 'W45N51',
            // location: W44N53
            '59bbc42a2052a716c3ce77ce': 'W44N53',
            // location: W44N52
            '59bbc42b2052a716c3ce77d0': 'W44N52',
            // location: W44N51
            '59bbc42b2052a716c3ce77d3': 'W44N51',
            // location: W43N52
            '59bbc42d2052a716c3ce7822': 'W43N52',
            // location: W43N51
            '59bbc42d2052a716c3ce7824': 'W43N51',
            '59bbc42d2052a716c3ce7825': 'W43N51',
            // location: W42N51
            '59bbc4302052a716c3ce7862': 'W42N51',
            // location: W46N51
            '59bbc4262052a716c3ce7717': 'W46N51',
            '59bbc4262052a716c3ce7718': 'W46N51',
            // location: W47N52
            '59bbc4242052a716c3ce76bf': 'W47N52',
            '59bbc4242052a716c3ce76c1': 'W47N52',
            // location W45N54
            '59bbc4282052a716c3ce7768': 'W45N54',
            '59bbc4282052a716c3ce7766': 'W45N54',
            '59bbc4282052a716c3ce7767': 'W45N54',
            'W45N541': 'W45N54',
            'W45N542': 'W45N54',
            // location W44N54
            '59bbc42a2052a716c3ce77ca': 'W44N54',
            '59bbc42a2052a716c3ce77c8': 'W44N54',
            '59bbc42a2052a716c3ce77c7': 'W44N54',
            'W44N541': 'W44N54',
            'W44N542': 'W44N54',
            // location W45N55
            '59bbc4282052a716c3ce7762': 'W45N55',
            '59bbc4282052a716c3ce7761': 'W45N55',
            '59bbc4282052a716c3ce7760': 'W45N55',
            'W45N551': 'W45N55',
            'W45N552': 'W45N55',
            'W45N553': 'W45N55',
            'W45N554': 'W45N55',
            // location W43N54
            '59bbc42d2052a716c3ce781b': 'W43N54',
            '59bbc42d2052a716c3ce7819': 'W43N54',
        }

        Memory.energyMap = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 1500,
            '59bbc4262052a716c3ce7712': 1500,
            // location: W45N52
            '59bbc4282052a716c3ce7771': 1500,
            '59bbc4282052a716c3ce7772': 1500,
            // location: W45N51
            '59bbc4282052a716c3ce7776': 1500,
            '59bbc4282052a716c3ce7777': 1500,
            // location: W44N53
            '59bbc42a2052a716c3ce77ce': 1500,
            // location: W44N52
            '59bbc42b2052a716c3ce77d0': 1500,
            // location: W44N51
            '59bbc42b2052a716c3ce77d3': 1500,
            // location: W43N52
            '59bbc42d2052a716c3ce7822': 1500,
            // location: W43N51
            '59bbc42d2052a716c3ce7824': 1500,
            '59bbc42d2052a716c3ce7825': 1500,
            // location: W42N51
            '59bbc4302052a716c3ce7862': 1500,
            // location: W46N51
            '59bbc4262052a716c3ce7717': 1500,
            '59bbc4262052a716c3ce7718': 1500,
            // location: W47N52
            '59bbc4242052a716c3ce76bf': 1500,
            '59bbc4242052a716c3ce76c1': 1500,
            // location W45N54
            '59bbc4282052a716c3ce7768': 4000,
            '59bbc4282052a716c3ce7766': 4000,
            '59bbc4282052a716c3ce7767': 4000,
            'W45N541': 1500,
            'W45N542': 1500,
            // location W44N54
            '59bbc42a2052a716c3ce77ca': 4000,
            '59bbc42a2052a716c3ce77c8': 4000,
            '59bbc42a2052a716c3ce77c7': 4000,
            'W44N541': 1500,
            'W44N542': 1500,
            // location W45N55
            '59bbc4282052a716c3ce7762': 4000,
            '59bbc4282052a716c3ce7761': 4000,
            '59bbc4282052a716c3ce7760': 4000,
            'W45N551': 1500,
            'W45N552': 1500,
            'W45N553': 1500,
            'W45N554': 1500,
            // location W43N54
            '59bbc42d2052a716c3ce781b': 1500,
            '59bbc42d2052a716c3ce7819': 1500,
        }

        Memory.homeMap = {
            'W42N51': 'W41N51',
            'W43N51': 'W41N51',
            'W43N52': 'W43N53',
            'W44N51': 'W41N51',
            'W44N52': 'W43N53',
            'W44N53': 'W43N53',
            'W45N51': 'W46N52',
            'W45N52': 'W45N53',
            'W45N54': 'W45N53',
            'W46N53': 'W45N53',
            'W46N51': 'W46N52',
            'W47N52': 'W46N52',
            'W45N54': 'W45N53',
            'W44N54': 'W43N53',
            'W45N55': 'W45N53',
            'W43N54': 'W43N53',
        }
    },
}

export default cronJobs;
