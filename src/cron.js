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
            '59bbc4302052a716c3ce7862': 0,
        }
        global.register_thieves = true;
        global.rooms = {
            // location: W46N53
            '59bbc4262052a716c3ce7711': 'W46N53',
            '59bbc4262052a716c3ce7712': 'W46N53',
            // location: W45N52
            '59bbc4282052a716c3ce7771': 'W45N52',
            '59bbc4282052a716c3ce7772': 'W45N52',
            // location: W46N51
            '59bbc4282052a716c3ce7776': 'W46N51',
            '59bbc4282052a716c3ce7777': 'W46N51',
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
        }
        global.register_thieves = true;
    },
}

export default cronJobs;
