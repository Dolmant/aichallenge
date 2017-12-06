// @flow

import roleThief from './roles/role.thief';
import roleThiefMule from './roles/role.thiefmule';

const spawnType = {
    defcon(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 1, 25],
            [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S']
        );
    },
    grinder(myRoom: Room) {
        return processBody(myRoom,
            [[ATTACK, ATTACK, ATTACK], 'S']
            [[MOVE], 'M', 0.6, 0],
            [[HEAL], 'M', 0.4, 0],
            [[MOVE], 'S']
        );
    },
    guard(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 0.4, 17],
            [[RANGED_ATTACK], 'M', 0.2, 3],
            [[ATTACK], 'M', 0.4, 10]
        );
    },
    farm(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 1, 25],
            [[TOUGH, TOUGH], 'S'],
            [[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'S'],
            [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S']
        );
    },
    heal(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 1, 20],
            [[HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL], 'S']
        );
    },
    thief(myRoom: Room, options: any) {
        let amount = 3;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 1500) {
            amount = 6;
            if (Memory.energyMap[options.sourceMap] > 3000) {
                amount = 8;
            }
        }
        return processBody(myRoom,
            [[CARRY], 'S'],
            [[MOVE], 'M', 1, 5],
            [[WORK], 'M', 1, amount]
        );
    },
    harvester(myRoom: Room) {
        if (myRoom.memory.hasMules && myRoom.memory.hasContainers) {
            return processBody(myRoom,
                [[CARRY], 'S'],
                [[MOVE], 'M', 0.25, 4],
                [[WORK], 'M', 0.75, 6],
            );
        } else {
            return processBody(myRoom,
                [[CARRY], 'M', 0.25, 4],
                [[MOVE], 'M', 0.25, 8],
                [[WORK], 'M', 0.5, 6]
            );
        }
    },
    worker(myRoom: Room) {
        return processBody(myRoom,
            [[CARRY], 'M', 0.25, 5],
            [[MOVE], 'M', 0.25, 10],
            [[WORK], 'M', 0.75, 15],
        );
    },
    mule(myRoom: Room) {
        return processBody(myRoom,
            [[CARRY, MOVE, CARRY], 'M', 1, 6]
        );
    },
    thiefmule(myRoom: Room, options: any) {
        let amount = 6;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 3000) {
            amount = 16;
        }
        return processBody(myRoom,
            [[WORK, MOVE, CARRY], 'S'],
            [[CARRY, MOVE, CARRY], 'M', 1, amount]
        );
    },
}

/*
takes all args
each one is an array
[command, parts(array), command arg1, command arg2]

commands: 
S: single mandatory (no more than 300)
M: multiple, implied optional
(arg1 is a PERCENTAGE between 0 and 1 of the ENERGY leftover after single options)
(arg2 is the MAXIMUM number of iterations)


if over 300, returns first 300 worth of commands.
*/

function processBody(myRoom, ...commands) {
    let finalBuild = commands.map(() => ({
        cost: 0,
        parts: [],
    }));
    // SM
    let totalCost = 0;
    let multiplier = 0;
    commands.forEach((command, index) => {
        if (command[0] === 'S') {
            let cost = 0;
            command[1].forEach(part => {
                cost += BODYPART_COST[part];
            });
            // if cost over 300, truncate
            totalCost += cost;
            finalBuild[index].cost = cost;
            finalBuild[index].parts = command[1];
        } else if (command[0] === 'M') {
            multiplier += command[2];
        }
    });

    const totalAvailable = myRoom.energyAvailable - totalCost;

    // MM
    let proportionBonus = 0;
    commands.forEach((command, index) => {
        if (command[0] === 'M') {
            let commandCost = 0;
            command[1].forEach(part => {
                commandCost += BODYPART_COST[part];
            });
            const proportion = command[2];
            const commandMaxCost = totalAvailable * proportion + proportionBonus;
            const numberOfCommands = command[3] || Math.floor(commandMaxCost / commandCost);
            const commandFinalCost =  numberOfCommands * commandCost;
            totalCost += commandFinalCost;
            proportionBonus = commandMaxCost - commandFinalCost;
            finalBuild[index].cost = commandFinalCost;
            const finalArray = [];
            for (var i = 0; i < numberOfCommands; i +=1) {
                finalArray.concat(command[1]);
            }
            finalBuild[index].parts = finalArray;
        }
    });

    // Build final return
    const result = [];
    finalBuild.forEach((buildOrder) => {
        result.concat(buildOrder.parts);
    });
    return result;
}

export default spawnType;