import { GameFactory } from "./game_factory";
import { LiveGameRepository } from "./live_repository";
import Response from "@verbatim/shared/response";
import { Tense } from "../models/tenses";
import { Game, GameMode, Duration } from "../models/game";
import { Player } from "../models/player";
import { PlayerFactory } from "./player_factory";
import { Logger } from "../../../ports/logger";

/** Coordinates the lifecycle of live games and players (creation, conversion, removal, countdowns). */
export interface LiveGameService {
    /** Removes a player from the game (entity) and the live repository. */
    removePlayer: (playerId: string) => Response;
    /** Removes a game from the live repository, cascading player removal and notifying clients. */
    removeGame: (gameCode: string) => Response;
    /** Creates a game, registers it in the live repository, and returns it. */
    createGame: (mode: GameMode, duration: Duration, tenses: Tense[]) => Response<Game>;
    /** Creates a player, registers it in the live repository, and adds them to the game. */
    createPlayer: (playerId: string, game: Game, username: string, mode: GameMode | 'lobby') => Response<Player>;
    /** Converts a game to the subclass corresponding with the gamemode  */
    convertGame: (game: Game, gameMode: GameMode) => Response;
    /** Converts a player to the subclass corresponding with the gamemode */
    convertPlayer: (player: Player, gameMode: GameMode) => Response<Player>;
    /** Begins the pre-start countdown that transitions the game to 'active' */
    startGameCountdown: (game: Game, logger?: Logger) => void;
    /** Cancels the pre-start countdown and resets the game to 'waiting' */
    stopGameCountdown: (game: Game, logger?: Logger) => void;
}

const createLiveGameService = (
    liveRepository: LiveGameRepository,
    gameFactory: GameFactory,
    playerFactory: PlayerFactory,
): LiveGameService => {
    const initialStartCounter = 5;

    return {
        removePlayer(playerId) {
            const playerRes = liveRepository.getPlayer(playerId);
            const player = playerRes.data;
            if (!player) return playerRes;

            const game = liveRepository.getGame(player.gameCode).data;
            if (game) {
                game.removePlayer(playerId);
            }
            return liveRepository.removePlayer(playerId);
        },

        removeGame(gameCode) {
            const getGameRes: Response<Game> = liveRepository.getGame(gameCode);
            if (!getGameRes.data) return getGameRes;

            const game = getGameRes.data;

            game.players.forEach(player => {
                liveRepository.removePlayer(player.id);
            });
            game.players.clear();

            game.notifyDestroyed();
            return liveRepository.removeGame(gameCode);
        },

        createGame(mode, duration, tenses) {
            const createGameRes = gameFactory(mode, duration, tenses);
            if (createGameRes.data) {
                liveRepository.addGame(createGameRes.data);
            }
            return createGameRes;
        },

        createPlayer(playerId, game, username, mode) {
            const createPlayerRes = playerFactory(playerId, game.code, username, mode);
            if (createPlayerRes.data) {
                const newPlayer = createPlayerRes.data;
                liveRepository.addPlayer(newPlayer);
                game.addPlayer(newPlayer);
            }
            return createPlayerRes;
        },

        convertGame(game, gameMode) {
            const newGameRes = gameFactory(gameMode, game.settings.duration, game.settings.tenses);
            if (!newGameRes.data) return newGameRes;

            const newGame = newGameRes.data;
            liveRepository.removeGame(game.code);
            liveRepository.addGame(newGame);
            return newGameRes;
        },

        convertPlayer(player, gameMode) {
            const newPlayerRes = playerFactory(player.id, player.gameCode, player.username, gameMode);
            if (!newPlayerRes.data) return newPlayerRes;

            const newPlayer = newPlayerRes.data;
            liveRepository.removePlayer(player.id);
            liveRepository.addPlayer(newPlayer);

            const gameRes = liveRepository.getGame(player.gameCode);
            if (!gameRes.data) {
                return gameRes as Response as Response<Player>;
            }
            const game = gameRes.data;
            game.players.delete(player);
            return newPlayerRes;
        },

        startGameCountdown(game, logger) {
            logger?.info(`Game ${game.code} starting`);

            game.setCounter(initialStartCounter);
            game.setState('starting');

            const timer: NodeJS.Timeout = setInterval(() => {
                if (game.state !== 'starting') {
                    clearInterval(timer);
                    return;
                }

                if (game.counter === 1) {
                    clearInterval(timer);
                    game.setState('active');

                    // Convert lobby players into game-mode-specific players
                    const convertedPlayers: Player[] = [];
                    Array.from(game.players).forEach(player => {
                        const convertedRes = this.convertPlayer(player, game.settings.mode as GameMode);
                        if (convertedRes.data) {
                            convertedPlayers.push(convertedRes.data);
                        }
                    });

                    game.onStart(convertedPlayers);
                    return;
                }

                game.setCounter(game.counter - 1);
            }, 1000);
        },

        stopGameCountdown(game, logger) {
            logger?.info(`Game ${game.code} stopping`);

            game.setState('waiting');
            game.setCounter(initialStartCounter);
        },
    };
};

export default createLiveGameService;
