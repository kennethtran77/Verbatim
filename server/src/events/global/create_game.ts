import { Duration, Game } from "../../models/game";
import Response from "../../models/response";
import { GameService } from "../../services/global/game_service";
import { TenseStore } from "../../services/global/tense_store";

export type CreateGameEvent = (mode: string, duration: Duration, tenses: string[]) => Response<string>;

const useCreateGameEvent = (
    gameModes: string[],
    tenseStore: TenseStore,
    gameService: GameService
): CreateGameEvent => {
    return (mode, duration, tenses) => {
        // validate input
        if (!gameModes.includes(mode)) {
            return {
                success: false,
                message: 'Invalid gamemode.'
            };
        }

        const durationSeconds = (duration.minutes * 60) + duration.seconds;
        const requiredSeconds = 30;

        if (durationSeconds < requiredSeconds) {
            return {
                success: false,
                message: `The game must be at least ${requiredSeconds} seconds long.`
            };
        }
        
        if (durationSeconds > 300) {
            return {
                success: false,
                message: `The game cannot be longer than 5 minutes.`
            };
        }
        
        if (!tenses.length) {
            return {
                success: false,
                message: 'The game must contain at least one tense.'
            };
        }

        const validateTensesRes = tenseStore.validateTenses(tenses);
        const tenseItems = validateTensesRes.data;

        if (!tenseItems) {
            return {
                success: false,
                message: validateTensesRes.message
            };
        }

        // create a new game object
        const createGameRes: Response<Game> = gameService.createGame(mode, duration, tenseItems);
        const newGame = createGameRes.data;

        if (newGame) {
            return {
                success: true,
                message: createGameRes.message,
                data: newGame.code
            };
        }

        return {
            success: false,
            message: createGameRes.message
        };
    }
}

export default useCreateGameEvent;