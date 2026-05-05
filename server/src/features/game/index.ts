import createCreateGameEvent, { CreateGameEvent } from './events/create_game';
import createGetGameStatusEvent, { GetGameStatusEvent } from './events/get_game_status';
import createJoinGameEvent, { JoinGameEvent } from './events/join_game';
import createQuitGameEvent, { QuitGameEvent } from './events/quit_game';
import createSetReadyEvent, { SetReadyEvent } from './events/set_ready';
import createConjugationRaceGameFactory from '../conjugation-race/services/game_factory';
import { createConjugationRacePlayerFactory } from '../conjugation-race/services/player_factory';
import createVerbService from '../conjugation-race/services/verb_service';
import createGameCodeGenerator, { GameCodeGeneratorService } from './services/code_generator';
import createGameFactory from './services/game_factory';
import createLiveGameService, { LiveGameService } from './services/live_game_service';
import { LiveGameRepository } from './services/live_repository';
import { createLobbyPlayerFactory } from './services/lobby_player_factory';
import createUsernameGenerator, { UsernameGeneratorService } from './services/name_generator';
import createPlayerFactory from './services/player_factory';
import createTenseStore, { TenseStore } from './services/tense_store';
import { gameModes } from './models/game';
import { tenses } from './models/tenses';
import createConsoleLogger from '../../adapters/console/logger';
import { Logger } from '../../ports/logger';
import { EventEmitterService } from '../../ports/event_emitter';
import { EventListenerService } from '../../ports/event_listener';
import { ConjugationRaceRepository } from '../conjugation-race/ports/repository';
import { GameRepository } from './ports/repository';

export interface GameEvents {
    handleJoinGameEvent: JoinGameEvent;
    handleCreateGameEvent: CreateGameEvent;
    handleQuitGameEvent: QuitGameEvent;
    handleGetGameStatusEvent: GetGameStatusEvent;
    handleSetReadyEvent: SetReadyEvent;
}

export interface Repositories {
    liveGameRepository: LiveGameRepository;
    gameRepository: GameRepository;
    conjugationRaceRepository: ConjugationRaceRepository;
}

export interface GameContext {
    liveGameService: LiveGameService;
    liveRepository: LiveGameRepository;
    tenseStore: TenseStore;
    logger: Logger;
    generateGameCode: GameCodeGeneratorService;
    generateUsername: UsernameGeneratorService;
    eventEmitter: EventEmitterService;
}

const names: string[] = ["Apple", "Banana", "Pear", "Kiwi", "Grapefruit", "Watermelon", "Grape", "Strawberry", "Peach", "Lemon", "Lime"];

export const createGameEvents = (
    eventListener: EventListenerService,
    context: GameContext,
): GameEvents => ({
    handleJoinGameEvent: createJoinGameEvent(eventListener, context.generateUsername, context.liveGameService, context.liveRepository, context.logger),
    handleCreateGameEvent: createCreateGameEvent(gameModes, context.tenseStore, context.liveGameService),
    handleQuitGameEvent: createQuitGameEvent(eventListener, context.liveGameService, context.liveRepository, context.logger),
    handleGetGameStatusEvent: createGetGameStatusEvent(context.liveRepository),
    handleSetReadyEvent: createSetReadyEvent(context.liveGameService, context.liveRepository),
});

export const createGameContext = (
    env: 'prod' | 'dev',
    eventEmitter: EventEmitterService,
    repositories: Repositories,
): GameContext => {
    const liveRepository: LiveGameRepository = repositories.liveGameRepository;
    const conjugationRaceRepository: ConjugationRaceRepository = repositories.conjugationRaceRepository;
    const liveGameService: LiveGameService = createLiveGameService(
        liveRepository,
        createGameFactory(
            createGameCodeGenerator((gameCode: string) => Boolean(liveRepository.getGame(gameCode).data)),
            eventEmitter,
            createConjugationRaceGameFactory(
                eventEmitter,
                createVerbService(),
                conjugationRaceRepository,
            ),
        ),
        createPlayerFactory(
            createLobbyPlayerFactory(),
            createConjugationRacePlayerFactory(),
        ),
    );

    return {
        liveGameService,
        liveRepository,
        tenseStore: createTenseStore(tenses),
        logger: createConsoleLogger(env),
        generateGameCode: createGameCodeGenerator((gameCode: string) => Boolean(liveRepository.getGame(gameCode).data)),
        generateUsername: createUsernameGenerator(names),
        eventEmitter,
    };
};
