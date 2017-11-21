/**
 * Memory - Used to store arbitrary memory entries in arbitrary keys.
 * @type {Object<string, any>}
 */

 export type RoomMemory = {
    marshalDisrupter: boolean,
    spawnClaimer: number,
    marshalForce: boolean,
    timer: number,
    structures: {},
    links: {},
    sources: {},
    energyRation: number,
    runUpdate: boolean,
    hasStorage: boolean,
    hasContainers: boolean,
    hasLinks: boolean,
    hasExtractor: boolean,
    hasMules: number,
    owner: boolean,
    myCreepCount: myCreepCountType,
    requests: Array<{[string]: string}>
};

declare var Memory: {
    creeps: {
        [string]: Creep,
    },
    muleFlag: number,
    stealFlag: number,
    attackers: {
        attacking: boolean,
        forceSize: number,
        forceInAction: {
            healer: number,
            ranged: number,
            thief: number,
            melee: number,
        },
        forceInActionCount:{
            healer: number,
            ranged: number,
            thief: number,
            melee: number,
        }
    },
    methods: {
        createRemoteWorkers: number,
    },
    misc: {
        requests: Array<CreepMemory>,
        globalCreepsTemp: {
            healer: number,
            ranged: number,
            thief: number,
            melee: number,
            thiefmule: number,
            claimer: number,
            tough: number,
            blocker: number,
        },
        globalCreeps: {
            healer: number,
            ranged: number,
            thief: number,
            melee: number,
            thiefmule: number,
            claimer: number,
            tough: number,
            blocker: number,
        },
    },
    rooms: {
        [string]: RoomMemory,
    },
    processedQueue: Array<string>,
    squads: {
        [string]: {
            roomTarget: string,
            stagingTarget: {
                x: number,
                y: number,
                roomName: string,
            },
            stagingTarget: {
                x: number,
                y: number,
                roomName: string,
            },
            myTask: string,
            composition: any,
            size: number,
        }
    },
    stats: any
};
