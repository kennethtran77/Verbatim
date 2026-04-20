import { ConjugationRaceGame } from "../../conjugation-race/models/conjugation_race";
import { GameMode, Duration, Game } from "../models/game";
import Response from "../../../shared/response";
import { Tense } from "../models/tenses";
import { ConjugationRaceGameFactory } from "../../conjugation-race/services/game_factory";
import { GameCodeGeneratorService } from "./code_generator";
import { GameService } from "./game_service";

export type GameFactory = (mode: GameMode, duration: Duration, tenses: Tense[]) => Response<Game>;

const createGameFactory = (
    generateGameCode: GameCodeGeneratorService,
    conjugationGameRaceFactory: ConjugationRaceGameFactory
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
            onStart(gameService: GameService) {
                gameService.setGameCounter(this, this.settings.duration.minutes * 60 + this.settings.duration.seconds);
                this.startTime = new Date();

                const timer: NodeJS.Timer = setInterval(() => {
                    if (this.state !== 'active') {
                        clearInterval(timer);
                        return;
                    }

                    if (this.counter === 1) {
                        clearInterval(timer);
                        gameService.setGameState(this, 'ending');
                        this.onEnd(gameService);
                        // gameService.removeGame(this);
                        return;
                    }

                    gameService.setGameCounter(this, this.counter - 1);
                }, 1000);
            },
            onEnd(gameService: GameService) {
                this.endTime = new Date();
            }
        }, Game.prototype);

        switch (mode) {
            case 'conjugation-race':
                newGame = conjugationGameRaceFactory(newGame);
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

export default createGameFactory;