import { Game, GameData } from "../../models/game";
import { DatabaseService } from "./db_service";

export interface GameDbService {
    saveGameData: (game: Game) => Promise<void>;
    getGameData: (gameCode: string) => Promise<GameData | null>;
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
        async getGameData(gameCode) {
            try {
                // Get game data
                const result = await dbService.query(
                    'SELECT * FROM game WHERE code = $1;',
                    [gameCode]
                );

                if (result.rows.length === 0) {
                    return null;
                }
                const gameRow = result.rows[0];

                // Get tenses used by the game
                const tensesResult = await dbService.query(
                    'SELECT * FROM tense WHERE game_code = $1;',
                    [gameCode]
                );
                let tenses: string[] = tensesResult.rows.map((row: any) => row.tense);

                const gameData: GameData = {
                    code: gameRow.code,
                    mode: gameRow.mode,
                    tenses: tenses,
                    duration: {
                        minutes: Math.floor(gameRow.duration / 60),
                        seconds: gameRow.duration % 60
                    },
                    maxPlayers: gameRow.max_players,
                    startTime: gameRow.start_time,
                    endTime: gameRow.end_time,
                };
                return gameData;
            } catch (err) {
                console.error(`Failed to get game ${gameCode}:`, err);
                throw err;
            }
        }
    }
};

export default useGameDbService;
