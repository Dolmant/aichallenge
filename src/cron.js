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
    },
    run10() {
        Object.keys(Memory.thieving_spots).forEach(key => {
            if (Memory.thieving_spots[key] && !Game.creeps[Memory.thieving_spots[key]]) {
                Memory.thieving_spots[key] = 0;
            }
        });

        const myRooms = ['W43N53', 'W45N53', 'W41N51', 'W46N52'];
        myRooms.concat(Memory.possibleTargets);

        myRooms.forEach(roomName => {
            let myRoom = Game.rooms[roomName]
            if (myRoom) {
                var enemyCreeps: Creep = myRoom.find(FIND_HOSTILE_CREEPS);
                myRoom.memory.defcon = enemyCreeps.length;
                if (Memory.squads[roomName + 'defcon']) {
                    if (Memory.squads[roomName + 'defcon'].size != enemyCreeps.length) {
                        brains.updateSquadSize(roomName + 'defcon', enemyCreeps.length);
                    }
                } else if (enemyCreeps.length > 0) {
                    brains.createSquad(roomName + 'defcon', roomName, enemyCreeps.length, 'defcon');
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
    },
}

export default cronJobs;
