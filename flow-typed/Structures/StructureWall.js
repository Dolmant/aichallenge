/**
 * Blocks movement of all creeps.
 *
 * @class
 * @extends {Structure}
 *
 * @see {@link http://support.screeps.com/hc/en-us/articles/208437125-StructureWall}
 */
export type StructureWall = Structure & {
    /**
     * The amount of game ticks when the wall will disappear (only for automatically placed border walls at the start of the game).
     *
     * @see {@link http://support.screeps.com/hc/en-us/articles/208437125-StructureWall#ticksToLive}
     *
     * @type {number}
     */
    ticksToLive: 0
};
