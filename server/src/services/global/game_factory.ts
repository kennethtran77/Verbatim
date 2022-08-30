import { ConjugationRaceGame } from "../../models/conjugation_race";
import { GameMode, Duration, Game } from "../../models/game";
import Response from "../../models/response";
import { Tense } from "../../models/tenses";
import { GameCodeGeneratorService } from "../lobby/code_generator";

export type GameFactory = (mode: GameMode, duration: Duration, tenses: Tense[]) => Response<Game>;

const useGameFactory = (
    generateGameCode: GameCodeGeneratorService,
    createConjugationRaceGame: (game: Game) => ConjugationRaceGame
): GameFactory => {
    return (mode, duration, tenses) => {
        const gameCode = generateGameCode();
        let newGame: Game = Object.setPrototypeOf({
            code: gameCode,
            state: 'waiting',
            counter: 10,
            players: new Set(),
            playersReady: 0,
            settings: {
                mode,
                tenses,
                duration
            },
            gameStartData: {},
            onStart: () => {}
        }, Game.prototype);

        switch (mode) {
            case 'conjugation-race':
                newGame = createConjugationRaceGame(newGame);
                break;
            default:
                break;
        }
        
        return {
            success: true,
            message: "Created new game",
            data: newGame
        }
    }
}

export default useGameFactory;