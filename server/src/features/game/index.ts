import useCreateGameEvent, { CreateGameEvent } from './events/create_game';
import useGetGameStatusEvent, { GetGameStatusEvent } from './events/get_game_status';
import useJoinGameEvent, { JoinGameEvent } from './events/join_game';
import useQuitGameEvent, { QuitGameEvent } from './events/quit_game';
import useSetReadyEvent, { SetReadyEvent } from './events/set_ready';
import useConjugationRaceGameFactory from '../conjugation-race/services/game_factory';
import { useConjugationRacePlayerFactory } from '../conjugation-race/services/player_factory';
import useVerbService from '../conjugation-race/services/verb_service';
import useConjugationRaceDbService, { ConjugationRaceDbService } from '../conjugation-race/services/db';
import useGameCodeGenerator, { GameCodeGeneratorService } from './services/code_generator';
import useGameFactory from './services/game_factory';
import useGameService, { GameService } from './services/game_service';
import useMemGameRepository, { GameRepository } from './services/game_repository';
import { useLobbyPlayerFactory } from './services/lobby_player_factory';
import useUsernameGenerator, { UsernameGeneratorService } from './services/name_generator';
import usePlayerFactory from './services/player_factory';
import useTenseStore, { TenseStore } from './services/tense_store';
import useGameDbService, { GameDbService } from './services/game_db';
import { gameModes } from './models/game';
import { tenses } from './models/tenses';
import useConsoleLogger from '../../adapters/console/logger';
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

export const useGameEvents = (eventListener: EventListenerService, gameServices: GameServices): GameEvents => ({
    handleJoinGameEvent: useJoinGameEvent(eventListener, gameServices.generateUsername, gameServices.gameService, gameServices.logger),
    handleCreateGameEvent: useCreateGameEvent(gameModes, gameServices.tenseStore, gameServices.gameService),
    handleQuitGameEvent: useQuitGameEvent(eventListener, gameServices.gameService, gameServices.logger),
    handleGetGameStatusEvent: useGetGameStatusEvent(gameServices.gameService),
    handleSetReadyEvent: useSetReadyEvent(gameServices.gameService),
});

export const useGameServices = (env: 'prod' | 'dev', eventEmitter: EventEmitterService, dbService: DatabaseService): GameServices => {
    const gameRepository: GameRepository = useMemGameRepository();
    const gameDbService: GameDbService = useGameDbService(dbService);
    const conjugationRaceDbService: ConjugationRaceDbService = useConjugationRaceDbService(dbService, gameDbService);
    const gameService: GameService = useGameService(
        gameRepository,
        useGameFactory(
            useGameCodeGenerator((gameCode: string) => Boolean(gameService.getGame(gameCode).data)),
            useConjugationRaceGameFactory(
                conjugationRaceDbService,
                useVerbService()
            )
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
        eventEmitter,
        gameDbService,
        conjugationRaceDbService,
    };
};
