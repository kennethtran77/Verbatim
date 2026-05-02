import { ConjugationRaceGame, VerbResponse } from "../models/conjugation_race";

export interface ConjugationRaceRepository {
    // Saves the game data to disk
    saveGameData: (game: ConjugationRaceGame) => Promise<void>;
    // Retrieves the verb responses for a given player in a given game
    getPlayerVerbResponses: (gameCode: string, playerId: string) => Promise<VerbResponse[]>;
    // Retrieves the full game history (state and all players' verb responses)
    getGameHistory: (gameCode: string) => Promise<any>;
}
