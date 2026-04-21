import { Game, GameConnectionData } from "../models/game";
import Response from "../../../../../shared/response";
import { LobbyPlayer, Player } from "../models/player";
import { EventListenerService } from "../../../ports/event_listener";
import { UsernameGeneratorService } from "../services/name_generator";
import { Logger } from "../../../ports/logger";
import { GameService } from "../services/game_service";

export type JoinGameEvent = (playerId: string, gameCode: string) => Response<GameConnectionData>;

const createJoinGameEvent = (
    eventListener: EventListenerService,
    generateUsername: UsernameGeneratorService,
    gameService: GameService,
    logger: Logger
): JoinGameEvent => {
    return (playerId, gameCode) => {
        // validate game
        const res: Response<Game> = gameService.getGame(gameCode);
        const game = res.data;
        
        if (!game) {
            return {
                success: false,
                message: res.message
            };
        }
        
        if (game.state !== 'waiting') {
            return {
                success: false,
                message: "The game has already started."
            }
        }

        if (game.players.size >= game.settings.maxPlayers) {
            return {
                success: false,
                message: "The game is already full."
            }
        }

        // create a new player object
        eventListener.subscribe(game.code);

        const newPlayerRes: Response<Player> = gameService.createPlayer(playerId, game, generateUsername(), 'lobby');

        if (!newPlayerRes.data) {
            return {
                success: false,
                message: newPlayerRes.message
            };
        }

        const newPlayer: Player = newPlayerRes.data;

        logger.info(`player ${newPlayer.username}, ${newPlayer.id} joined game ${game.code}`);

        // notify other players
        gameService.emitToGame('game:playerJoined', game.code, newPlayer);

        const players: LobbyPlayer[] = Array.from(game.players) as LobbyPlayer[];

        return {
            success: true,
            message: "Joined game",
            data: {
                state: game.state,
                initialPlayers: players,
                playerId: newPlayer.id,
                settings: game.settings 
            }
        };
    }
};

export default createJoinGameEvent;