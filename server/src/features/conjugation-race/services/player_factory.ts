import { ConjugationRacePlayer } from "../models/player";

export type ConjugationRacePlayerFactory = (id: string, gameCode: string, username: string) => ConjugationRacePlayer;

export const createConjugationRacePlayerFactory = (): ConjugationRacePlayerFactory =>
    (id, gameCode, username) => new ConjugationRacePlayer(id, gameCode, username);
