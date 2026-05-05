import Response from "../../../../../shared/response";
import { EventListenerService } from "../../../ports/event_listener";
import { LiveGameService } from "../services/live_game_service";
import { LiveGameRepository } from "../services/live_repository";
import { Logger } from "../../../ports/logger";

export type QuitGameEvent = (playerId: string) => Response;

const createQuitGameEvent = (
    eventHandler: EventListenerService,
    liveGameService: LiveGameService,
    liveRepository: LiveGameRepository,
    logger: Logger,
): QuitGameEvent => {
    return (playerId) => {
        const getPlayerRes = liveRepository.getPlayer(playerId);
        const player = getPlayerRes.data;

        if (!player) {
            return getPlayerRes as Response;
        }

        const getGameRes = liveRepository.getGame(player.gameCode);
        const game = getGameRes.data;

        if (!game) {
            return getGameRes as Response;
        }

        eventHandler.unsubscribe(player.gameCode);
        liveGameService.removePlayer(player.id);

        logger.info(`player ${player.username}, ${player.id} left game ${game.code}`);

        // stop countdown if game is starting and we no longer have enough players
        if (game.state === 'starting' && game.players.size < 2) {
            logger.info(`game ${game.code} stopped; not enough players`);
            liveGameService.stopGameCountdown(game);
        }

        // remove game if completely empty
        if (!game.players.size) {
            liveGameService.removeGame(game.code);
            logger.info(`destroying game ${game.code}`);
        }

        // end the game if active and only one player left
        if (game.state === 'active' && game.players.size === 1) {
            game.setState('ending');
        }

        return {
            success: true,
            message: "Player quit game.",
        };
    };
};

export default createQuitGameEvent;
