import { ConjugationRaceGame, Verb, VerbResponse } from "../models/conjugation_race";
import { DatabaseService } from "../../../ports/db_service";
import { GameDbService } from "../../game/services/game_db";

export interface ConjugationRaceDbService {
    // Saves the game data to disk
    saveGameData: (game: ConjugationRaceGame) => Promise<void>;
    // Retrieves the verb responses for a given player in a given game
    getPlayerVerbResponses: (gameCode: string, playerId: string) => Promise<VerbResponse[]>;
}

const createConjugationRaceDbService = (
    dbService: DatabaseService,
    gameDbService: GameDbService
): ConjugationRaceDbService => {
    return {
        async saveGameData(game) {
            try {
                await gameDbService.saveGameData(game);

                // Save conjugation race game record
                await dbService.query(
                    'INSERT INTO conjugation_race_game VALUES ($1);',
                    [game.code]
                );

                // Save verbs used in the game
                for (let index = 0; index < game.verbList.length; index++) {
                    const verb: Verb = game.verbList[index];
                    await dbService.query(
                        'INSERT INTO verb VALUES ($1, $2, $3, $4, $5, $6);',
                        [index + 1, verb.infinitive, verb.tense.value, verb.subject, verb.pronominal, game.code]
                    );
                }

                // Save player records and their verb responses
                for (const player of game.leaderboard) {
                    await dbService.query(
                        'INSERT INTO conjugation_race_player VALUES ($1, $2, $3, $4);',
                        [player.id, player.username, player.verbsSeen, game.code]
                    );

                    // Save all verb responses for the player
                    for (let index = 0; index < player.verbResponses.length; index++) {
                        const verbResponse = player.verbResponses[index];
                        await dbService.query(
                            'INSERT INTO verb_response VALUES ($1, $2, $3, $4, $5, $6, $7);',
                            [player.id, game.code, index + 1, verbResponse.input, verbResponse.correctAnswer, verbResponse.isInputCorrect, verbResponse.answerTime]
                        );
                    }
                }
            } catch (err) {
                console.error(`Failed to save conjugation race game ${game.code}:`, err);
                throw err;
            }
        },
        async getPlayerVerbResponses(gameCode, playerId) {
            try {
                const result = await dbService.query(
                    `SELECT vr.verb_id, v.infinitive, v.tense, v.subject,
                        vr.input, vr.correct_answer, vr.is_input_correct, vr.answer_time
                    FROM verb_response vr
                    JOIN verb v ON v.id = vr.verb_id AND v.game_code = vr.game_code
                    WHERE vr.game_code = $1 AND vr.player_id = $2
                    ORDER BY vr.verb_id;`,
                    [gameCode, playerId]
                );

                const verbResponses: VerbResponse[] = result.rows.map((row: any) => ({
                    verb: row.infinitive,
                    input: row.input,
                    correctAnswer: row.correct_answer,
                    isInputCorrect: row.is_input_correct,
                    answerTime: row.answer_time
                }));
                return verbResponses;
            } catch (err) {
                console.error(`Failed to get verb responses for player ${playerId} in game ${gameCode}:`, err);
                throw err;
            }
        }
    }
};

export default createConjugationRaceDbService;
