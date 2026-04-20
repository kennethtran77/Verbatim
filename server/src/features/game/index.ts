import createCreateGameEvent, { CreateGameEvent } from './events/create_game';
import createGetGameStatusEvent, { GetGameStatusEvent } from './events/get_game_status';
import createJoinGameEvent, { JoinGameEvent } from './events/join_game';
import createQuitGameEvent, { QuitGameEvent } from './events/quit_game';
import createSetReadyEvent, { SetReadyEvent } from './events/set_ready';
import createConjugationRaceGameFactory from '../conjugation-race/services/game_factory';
import { createConjugationRacePlayerFactory } from '../conjugation-race/services/player_factory';
import createVerbService from '../conjugation-race/services/verb_service';
import createConjugationRaceDbService, { ConjugationRaceDbService } from '../conjugation-race/services/db';
import createGameCodeGenerator, { GameCodeGeneratorService } from './services/code_generator';
import createGameFactory from './services/game_factory';
import createGameService, { GameService } from './services/game_service';
import createMemGameRepository, { GameRepository } from './services/game_repository';
import { createLobbyPlayerFactory } from './services/lobby_player_factory';
import createUsernameGenerator, { UsernameGeneratorService } from './services/name_generator';
import createPlayerFactory from './services/player_factory';
import createTenseStore, { TenseStore } from './services/tense_store';
import createGameDbService, { GameDbService } from './services/game_db';
import { gameModes } from './models/game';
import { tenses } from './models/tenses';
import createConsoleLogger from '../../adapters/console/logger';
import { Logger } from '../../ports/logger';
import { EventEmitterService } from '../../ports/event_emitter';
import { EventListenerService } from '../../ports/event_listener';
import { DatabaseService } from '../../ports/db_service';

export interface GameEvents {
    handleJoinGameEvent: JoinGameEvent;
    handleCreateGameEvent: CreateGameEvent;
    handleQuitGameEvent: QuitGameEvent;
    handleGetGameStatusEvent: GetGameStatusEvent;
    handleSetReadyEvent: SetReadyEvent;
}

export interface GameServices {
    gameService: GameService;
    tenseStore: TenseStore;
    logger: Logger;
    generateGameCode: GameCodeGeneratorService;
    generateUsername: UsernameGeneratorService;
    eventEmitter: EventEmitterService;
    gameDbService: GameDbService;
    conjugationRaceDbService: ConjugationRaceDbService;
}

const names: string[] = ["Apple", "Banana", "Pear", "Kiwi", "Grapefruit", "Watermelon", "Grape", "Strawberry", "Peach", "Lemon", "Lime"];

export const createGameEvents = (eventListener: EventListenerService, gameServices: GameServices): GameEvents => ({
    handleJoinGameEvent: createJoinGameEvent(eventListener, gameServices.generateUsername, gameServices.gameService, gameServices.logger),
    handleCreateGameEvent: createCreateGameEvent(gameModes, gameServices.tenseStore, gameServices.gameService),
    handleQuitGameEvent: createQuitGameEvent(eventListener, gameServices.gameService, gameServices.logger),
    handleGetGameStatusEvent: createGetGameStatusEvent(gameServices.gameService),
    handleSetReadyEvent: createSetReadyEvent(gameServices.gameService),
});

export const createGameServices = (env: 'prod' | 'dev', eventEmitter: EventEmitterService, dbService: DatabaseService): GameServices => {
    const gameRepository: GameRepository = createMemGameRepository();
    const gameDbService: GameDbService = createGameDbService(dbService);
    const conjugationRaceDbService: ConjugationRaceDbService = createConjugationRaceDbService(dbService, gameDbService);
    const gameService: GameService = createGameService(
        gameRepository,
        createGameFactory(
            createGameCodeGenerator((gameCode: string) => Boolean(gameService.getGame(gameCode).data)),
            createConjugationRaceGameFactory(
                conjugationRaceDbService,
                createVerbService()
            )
        ),
        createPlayerFactory(
            createLobbyPlayerFactory(),
            createConjugationRacePlayerFactory()
        ),
        eventEmitter
    );

    return {
        gameService,
        tenseStore: createTenseStore(tenses),
        logger: createConsoleLogger(env),
        generateGameCode: createGameCodeGenerator((gameCode: string) => Boolean(gameService.getGame(gameCode).data)),
        generateUsername: createUsernameGenerator(names),
        eventEmitter,
        gameDbService,
        conjugationRaceDbService,
    };
};
