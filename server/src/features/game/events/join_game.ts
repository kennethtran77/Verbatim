import { Game, GameConnectionData } from "../models/game";
import Response from "@verbatim/shared/response";
import { LobbyPlayer, Player } from "../models/player";
import { EventListenerService } from "../../../ports/event_listener";
import { UsernameGeneratorService } from "../services/name_generator";
import { Logger } from "../../../ports/logger";
import { LiveGameService } from "../services/live_game_service";
import { LiveGameRepository } from "../services/live_repository";

export type JoinGameEvent = (playerId: string, gameCode: string) => Response<GameConnectionData>;

const createJoinGameEvent = (
    eventListener: EventListenerService,
    generateUsername: UsernameGeneratorService,
    liveGameService: LiveGameService,
    liveRepository: LiveGameRepository,
    logger: Logger,
): JoinGameEvent => {
    return (playerId, gameCode) => {
        const res: Response<Game> = liveRepository.getGame(gameCode);
        const game = res.data;

        if (!game) {
            return { success: false, message: res.message };
        }

        if (game.state !== 'waiting') {
            return { success: false, message: "The game has already started." };
        }

        if (game.players.size >= game.settings.maxPlayers) {
            return { success: false, message: "The game is already full." };
        }

        eventListener.subscribe(game.code);

        const newPlayerRes: Response<Player> = liveGameService.createPlayer(playerId, game, generateUsername(), 'lobby');

        if (!newPlayerRes.data) {
            return { success: false, message: newPlayerRes.message };
        }

        const newPlayer: Player = newPlayerRes.data;

        logger.info(`player ${newPlayer.username}, ${newPlayer.id} joined game ${game.code}`);

        const players: LobbyPlayer[] = Array.from(game.players) as LobbyPlayer[];

        return {
            success: true,
            message: "Joined game",
            data: {
                state: game.state,
                initialPlayers: players,
                playerId: newPlayer.id,
                settings: game.settings,
            },
        };
    };
};

export default createJoinGameEvent;
