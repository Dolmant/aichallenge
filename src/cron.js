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
            cronJobs.init();
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
                    'goToTarget': target_room,
                    'stealTarget': target_room,
                    'home': home,
                    'name': newName,
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
                    if (Memory.squads[roomName + 'defcon'].size != myRoom.memory.defcon) {
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
    init() {
        Memory.thieving_spots = {
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
        }
        Memory.thieving_mules = {
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
        }
        Memory.register_thieves = true;
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
            'W46N53': 'W45N53',
            'W46N51': 'W46N52',
            'W47N52': 'W46N52',
        }
    },
}

export default cronJobs;
