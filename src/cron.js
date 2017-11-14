global.thieving_spots = {
    active: false,
    // location: creep
}

const cronJobs = {
    run() {
        if (global.thieving_spots && global.thieving_spots.active) {
        } else {
            global.thieving_spots.active = true;
            cronJobs.init();
        }
    },
    run10() {
        const checker = 4;
    },
    init() {
        global.thieving_spots = {
            active: true,
            // location: creep
        }
    }
}

export default cronJobs;
