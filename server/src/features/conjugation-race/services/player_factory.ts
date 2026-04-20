import { Player } from "../../game/models/player";
import { ConjugationRacePlayer } from "../models/player";

export type ConjugationRacePlayerFactory = (player: Player) => ConjugationRacePlayer;

export const useConjugationRacePlayerFactory = (): ConjugationRacePlayerFactory => {
    return (player) =>
        Object.setPrototypeOf(
        {
            ...player,
            verbsSeen: 1,
            verbsCorrect: 0,
            verbsIncorrect: 0,
            verbResponses: []
        },
        ConjugationRacePlayer.prototype
    );
};