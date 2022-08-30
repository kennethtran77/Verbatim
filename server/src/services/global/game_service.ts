import { GameFactory } from "./game_factory";
import { GameRepository } from "./game_repository";
import Response from "../../models/response";
import { Tense } from "../../../../client/src/models/tenses";
import { Game, GameMode, Duration, GameState } from "../../models/game";
import { Player } from "../../models/player";
import { PlayerFactory } from "./player_factory";
import { Logger } from "./logger";
import { EventEmitterService } from "./event_emitter";

/** Handles life cycle of games and players. */
export interface GameService {
    /** Removes a player from the game repository. Returns whether remove was successful. */
    removePlayer: (playerId: string) => Response;
    /** Removes a game from the game repository. Returns whether remove was successful. */
    removeGame: (gameCode: string) => Response;
    getPlayer: (playerId: string) => Response<Player>;
    getGame: (gameCode: string) => Response<Game>;
    /** Creates a game, registers it in the game repository, and returns it */
    createGame: (mode: GameMode, duration: Duration, tenses: Tense[]) => Response<Game>;
    /** Creates a player, registers it in the game repository, and returns it */
    createPlayer: (playerId: string, game: Game, username: string, mode: GameMode | 'lobby') => Response<Player>;
    /** Converts a game to the subclass corresponding with the gamemode  */
    convertGame: (game: Game, gameMode: GameMode) => Response;
    /** Converts a player to the subclass corresponding with the gamemode */
    convertPlayer: (player: Player, gameMode: GameMode) => Response<Player>;
    /** Emits data to all players in a game */
    emitToGame: (eventName: string, gameCode: string, data?: any) => void;
    setGameCounter: (game: Game, newCounter: number) => void;
    setGameState: (game: Game, newGameState: GameState) => void;
    startGameCountdown: (game: Game, logger?: Logger) => void;
    stopGameCountdown: (game: Game, logger?: Logger) => void;
}

const useGameService = (
    gameRepository: GameRepository,
    gameFactory: GameFactory,
    playerFactory: PlayerFactory,
    eventEmitter: EventEmitterService
): GameService => {
    const initialStartCounter = 5;

    return {
        removePlayer(playerId) {
            const player = gameRepository.getPlayer(playerId).data as Player;
            const game = gameRepository.getGame(player.gameCode).data as Game;
            game.players.delete(player);
            return gameRepository.removePlayer(playerId);
        },
        removeGame(gameCode) {
            const getGameRes: Response<Game> = gameRepository.getGame(gameCode);

            if (!getGameRes.data) {
                return getGameRes;
            }

            const game: Game = getGameRes.data;

            // remove all players from the game
            game.players.forEach(player => {
                game.players.delete(player);
                gameRepository.removePlayer(player.id);
            });

            // remove the game
            return gameRepository.removeGame(gameCode);
        },
        getPlayer(playerId) {
            return gameRepository.getPlayer(playerId);
        },
        getGame(gameCode) {
            return gameRepository.getGame(gameCode);
        },
        createGame(mode, duration, tenses) {
            const createGameRes: Response<Game> = gameFactory(mode, duration, tenses);

            if (createGameRes.data) {
                gameRepository.addGame(createGameRes.data);
            }

            return createGameRes;
        },
        createPlayer(playerId, game, username, mode) {
            const createPlayerRes: Response<Player> = playerFactory(playerId, game.code, username, mode);

            if (createPlayerRes.data) {
                const newPlayer: Player = createPlayerRes.data;

                gameRepository.addPlayer(newPlayer);
                // add player to set in game object
                game.players.add(newPlayer);
            }

            return createPlayerRes;
        },
        convertGame(game, gameMode) {
            const newGameRes: Response<Game> = gameFactory(gameMode, game.settings.duration, game.settings.tenses);

            if (!newGameRes.data) {
                return newGameRes;
            }

            // add new game to repository
            const newGame: Game = newGameRes.data;
            gameRepository.removeGame(game.code);
            gameRepository.addGame(newGame);

            return newGameRes;
        },
        convertPlayer(player, gameMode) {
            const newPlayerRes: Response<Player> = playerFactory(player.id, player.gameCode, player.username, gameMode);

            if (!newPlayerRes.data) {
                return newPlayerRes;
            }

            // add new player to repository
            const newPlayer: Player = newPlayerRes.data;
            gameRepository.removePlayer(player.id)
            gameRepository.addPlayer(newPlayer);
            const gameRes: Response<Game> = gameRepository.getGame(player.gameCode);

            if (!gameRes.data) {
                return gameRes as Response as Response<Player>;
            }

            // remove player from game's set of players
            const game: Game = gameRes.data;
            game.players.delete(player);
            return newPlayerRes;
        },
        emitToGame(eventName, gameCode, data) {
            eventEmitter.emit(eventName, gameCode, data);
        },
        setGameState(game, newGameState) {
            game.state = newGameState;
            this.emitToGame('game:stateChange', game.code, newGameState);
        },
        setGameCounter(game, newCounter) {
            game.counter = newCounter;
            this.emitToGame('game:counterChange', game.code, game.counter);
        },
        startGameCountdown(game, logger) {
            logger && logger.info(`Game ${game.code} starting`);
    
            this.setGameCounter(game, initialStartCounter);
            this.setGameState(game, 'starting');
    
            const timer: NodeJS.Timer = setInterval(() => {
                if (game.state !== 'starting') {
                    clearInterval(timer);
                    return;
                }
    
                if (game.counter === 1) {
                    clearInterval(timer);
                    this.setGameState(game, 'active');
                    game.onStart(this);
                    return;
                }
    
                this.setGameCounter(game, game.counter - 1);
            }, 1000);
        },
        stopGameCountdown(game, logger) {
            logger && logger.info(`Game ${game.code} stopping`);

            this.setGameState(game, 'waiting');
            this.setGameCounter(game, initialStartCounter);
        }
    };
};

export default useGameService;