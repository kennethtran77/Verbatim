import { ConjugationRaceGame, Verb } from "../../../models/conjugation_race";
import { DatabaseService } from "../../global/db_service";
import { GameDbService } from "../../global/game_db";

export interface ConjugationRaceDbService {
    saveGameData: (game: ConjugationRaceGame) => Promise<void>;
}

const useConjugationRaceDbService = (
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
    }
};

export default useConjugationRaceDbService;
