import { Game } from "../../models/game";
import { DatabaseService } from "./db_service";

export interface GameDbService {
    saveGameData: (game: Game) => Promise<void>;
}

const useGameDbService = (
    dbService: DatabaseService
): GameDbService => {
    return {
        async saveGameData(game) {
            const game_seconds = game.settings.duration.minutes * 60 + game.settings.duration.seconds;

            try {
                // Save game record
                await dbService.query(
                    'INSERT INTO game VALUES ($1, $2, $3, $4, $5, $6, $7);',
                    [game.code, game.settings.mode, game.settings.maxPlayers, game_seconds, game.state, game.startTime, game.endTime]
                );

                // Save tenses used by the game
                for (const tense of game.settings.tenses) {
                    await dbService.query(
                        'INSERT INTO tense VALUES ($1, $2);',
                        [tense.value, game.code]
                    );
                }
            } catch (err) {
                console.error(`Failed to save game ${game.code}:`, err);
                throw err;
            }
        },
    }
};

export default useGameDbService;
