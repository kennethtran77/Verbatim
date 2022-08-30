import { LobbyPlayer } from "../../models/player";
import Response from "../../models/response";
import { EventListenerService } from "../../services/global/event_listener";
import { GameService } from "../../services/global/game_service";
import { Logger } from "../../services/global/logger";

export type QuitGameEvent = (playerId: string) => Response;

const useQuitGameEvent = (
    eventHandler: EventListenerService,
    gameService: GameService,
    logger: Logger
): QuitGameEvent => {
    return (playerId) => {
        const getPlayerRes = gameService.getPlayer(playerId);
        const player = getPlayerRes.data;

        if (!player) {
            return getPlayerRes as Response;
        }

        const getGameRes = gameService.getGame(player.gameCode);
        const game = getGameRes.data;

        if (!game) {
            return getGameRes as Response;
        }

        // remove player
        eventHandler.unsubscribe(player.gameCode);
        gameService.emitToGame("game:playerQuit", game.code, player);
        gameService.removePlayer(player.id);

        logger.info(`player ${player.username}, ${player.id} left game ${game.code}`);

        // decrement players ready if game in lobby
        // if (game.state === 'waiting' || game.state === 'starting') {
        if (player instanceof LobbyPlayer) {
            if (player.ready) {
                game.playersReady -= 1;
            }
        }

        // stop countdown if game is starting
        if (game.state === 'starting' && game.players.size < 2) {
            logger.info(`game ${game.code} stopped; not enough players`);
            gameService.stopGameCountdown(game);
        }

        // remove game if completely empty
        if (!game.players.size) {
            gameService.emitToGame('game:destroy', game.code);
            gameService.removeGame(game.code);
            logger.info(`destroying game ${game.code}`);
        }

        // end the game if active and only one player left
        if (game.state === 'active' && game.players.size === 1) {
            gameService.setGameState(game, 'ending');
        }

        return {
            success: true,
            message: "Player quit game."
        };
    }
};

export default useQuitGameEvent;