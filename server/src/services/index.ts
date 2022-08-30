import { Controller } from '../controllers/global';
import useCreateGameEvent, { CreateGameEvent } from '../events/global/create_game';
import useGetGameStatusEvent, { GetGameStatusEvent } from '../events/global/get_game_status';
import useJoinGameEvent, { JoinGameEvent } from '../events/global/join_game';
import useQuitGameEvent, { QuitGameEvent } from '../events/global/quit_game';
import useSetReadyEvent, { SetReadyEvent } from '../events/global/set_ready';
import useConjugationRaceGameFactory from './active/conjugation_race/conjugation_race_factory';
import { useConjugationRacePlayerFactory } from './active/conjugation_race/player_factory';
import useVerbService from './active/conjugation_race/verb_service';
import useGameCodeGenerator from './lobby/code_generator';
import { GameCodeGeneratorService } from './lobby/code_generator';
import { EventListenerService } from './global/event_listener';
import useGameFactory from './global/game_factory';
import useGameService, { GameService } from './global/game_service';
import useMemoryGameRepository, { GameRepository } from './global/game_repository';
import { useLobbyPlayerFactory } from './lobby/player_factory';
import useConsoleLogger, { Logger } from './global/logger';
import useUsernameGenerator from './lobby/name_generator';
import { UsernameGeneratorService } from './lobby/name_generator';
import usePlayerFactory from './global/player_factory';
import useTenseStore, { TenseStore } from './global/tense_store';
import { gameModes } from '../models/game';
import { EventEmitterService } from './global/event_emitter';
import { tenses } from '../models/tenses';

export interface GlobalEvents {
    handleJoinGameEvent: JoinGameEvent;
    handleCreateGameEvent: CreateGameEvent;
    handleQuitGameEvent: QuitGameEvent;
    handleGetGameStatusEvent: GetGameStatusEvent;
    handleSetReadyEvent: SetReadyEvent;
}

export interface GlobalServices {
    gameService: GameService;
    tenseStore: TenseStore;
    logger: Logger;
    generateGameCode: GameCodeGeneratorService;
    generateUsername: UsernameGeneratorService;
    eventEmitter: EventEmitterService;
}

// define functions that initialize dependencies here
const names: string[] = ["Apple", "Banana", "Pear", "Kiwi", "Grapefruit", "Watermelon", "Grape", "Strawberry", "Peach", "Lemon", "Lime"];

export const useGlobalEvents = (eventHandler: EventListenerService, globalServices: GlobalServices): GlobalEvents => ({
    handleJoinGameEvent: useJoinGameEvent(eventHandler, globalServices.generateUsername, globalServices.gameService, globalServices.logger),
    handleCreateGameEvent: useCreateGameEvent(gameModes, globalServices.tenseStore, globalServices.gameService),
    handleQuitGameEvent: useQuitGameEvent(eventHandler, globalServices.gameService, globalServices.logger),
    handleGetGameStatusEvent: useGetGameStatusEvent(globalServices.gameService),
    handleSetReadyEvent: useSetReadyEvent(globalServices.gameService)
});

export const useGlobalServices = (env: 'prod' | 'dev', eventEmitter: EventEmitterService): GlobalServices => {
    const gameRepository: GameRepository = useMemoryGameRepository();
    const gameService: GameService = useGameService(
        gameRepository,
        useGameFactory(
            useGameCodeGenerator((gameCode: string) => Boolean(gameService.getGame(gameCode).data)),
            useConjugationRaceGameFactory(useVerbService())
        ),
        usePlayerFactory(
            useLobbyPlayerFactory(),
            useConjugationRacePlayerFactory()
        ),
        eventEmitter
    );

    return {
        gameService,
        tenseStore: useTenseStore(tenses),
        logger: useConsoleLogger(env),
        generateGameCode: useGameCodeGenerator((gameCode: string) => Boolean(gameService.getGame(gameCode).data)),
        generateUsername: useUsernameGenerator(names),
        eventEmitter
    };
};

/** Takes in an event listener service and a set of controllers and composes them from left to right */
export const composeControllers = (eventListener: EventListenerService) =>
    (...controllers: Controller[]) =>
        controllers.reduce((prevEventListener: EventListenerService, currController: Controller) => currController(prevEventListener), eventListener);
