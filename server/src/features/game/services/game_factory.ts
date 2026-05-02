import { Game, GameMode, Duration, GameSettings } from "../models/game";
import Response from "../../../../../shared/response";
import { Tense } from "../models/tenses";
import { ConjugationRaceGameFactory } from "../../conjugation-race/services/game_factory";
import { GameCodeGeneratorService } from "./code_generator";
import { EventEmitterService } from "../../../ports/event_emitter";

export type GameFactory = (mode: GameMode, duration: Duration, tenses: Tense[]) => Response<Game>;

const createGameFactory = (
    generateGameCode: GameCodeGeneratorService,
    eventEmitter: EventEmitterService,
    conjugationRaceGameFactory: ConjugationRaceGameFactory,
): GameFactory => (mode, duration, tenses) => {
    const code = generateGameCode();
    const settings: GameSettings = {
        mode,
        tenses,
        duration,
        maxPlayers: 30,
    };

    let newGame: Game;
    switch (mode) {
        case 'conjugation-race':
            newGame = conjugationRaceGameFactory(code, settings);
            break;
        default:
            newGame = new Game(eventEmitter, code, settings);
            break;
    }

    return {
        success: true,
        message: "Created new game",
        data: newGame,
    };
};

export default createGameFactory;
