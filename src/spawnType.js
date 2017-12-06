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
            [[ATTACK], 'M', 0.4, 10],
        );
    },
    farm(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 1, 25],
            [[TOUGH, TOUGH], 'S'],
            [[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'S'],
            [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S'],
        );
    },
    farm(myRoom: Room) {
        return processBody(myRoom,
            [[MOVE], 'M', 1, 25],
            [[TOUGH, TOUGH], 'S'],
            [[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK], 'S'],
            [[ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK], 'S'],
        );
    },
}
if (options.heal) {
    for (var i = 0; (i < Math.floor((referenceEnergy - 3750)/50) && i < 35); i += 1) {
        partArray.push(MOVE);
    }
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    partArray.push(HEAL);
    return partArray;
}
let workCount = 0;
if ((options.harvester && myRoom.memory.hasMules && myRoom.memory.hasLinks && myRoom.memory.hasContainers)) {
    totalEnergy -= 1;
    partArray.push(CARRY)
    while (totalEnergy >= 3 && workCount < MaxParts) {
        partArray.push(WORK)
        partArray.push(MOVE);
        totalEnergy -= 3;
        workCount += 1;
        if (totalEnergy >= 4 && workCount < MaxParts) {
            partArray.push(WORK)
            partArray.push(WORK)
            workCount += 2;
            totalEnergy -= 4;
        }
    }
    return partArray;
}
if (options.thief) {
    let amount = 3;
    if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 1500) {
        amount = 6;
        if (Memory.energyMap[options.sourceMap] > 3000) {
            amount = 8;
        }
    }
    partArray.push(CARRY);
    totalEnergy -= 1;
    while (totalEnergy >= 3 && workCount < amount) {
        partArray.push(WORK)
        partArray.push(MOVE);
        totalEnergy -= 3;
        workCount += 1;
    }
    return partArray;
}
if (options.harvester) {
    while (totalEnergy >= 4 && workCount < 6) {
        partArray.push(WORK)
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount += 1;
    }
    return partArray;
}
if (options.worker) {
    partArray.push(WORK)
    partArray.push(MOVE);
    partArray.push(CARRY);
    totalEnergy -= 4;
    workCount += 1;
    while (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy/300)) {
        partArray.push(WORK)
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        workCount += 1;
        if (totalEnergy >= 4 && workCount < 16 && workCount < Math.floor(referenceEnergy/300)) {
            partArray.push(WORK)
            totalEnergy -= 2;
            workCount += 1;
        }
    }
    return partArray;
}
if (options.mule || options.thiefmule) {
    let amount = 6;
    if (options.thiefmule) {
        amount = 6;
        partArray.push(WORK);
        partArray.push(MOVE);
        partArray.push(CARRY);
        totalEnergy -= 4;
        if (options.sourceMap && Memory.energyMap[options.sourceMap] && Memory.energyMap[options.sourceMap] > 3000) {
            amount = 15;
        }
    }
    while (totalEnergy >= 4  && workCount < amount) {
        partArray.push(MOVE);
        partArray.push(CARRY);
        partArray.push(CARRY);
        totalEnergy -= 3;
        workCount += 1;
    }
    return partArray;
}
while (totalEnergy >= 4  && workCount < 12) {
    partArray.push(WORK);
    partArray.push(MOVE);
    partArray.push(CARRY);
    partArray.push(CARRY);
    totalEnergy -= 5;
    workCount += 1;
}
return partArray;
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
