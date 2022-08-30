import { Game } from "../../models/game";
import { LobbyPlayer, Player } from "../../models/player";
import Response from "../../models/response";
import { GameService } from "../../services/global/game_service";

export type SetReadyEvent = (playerId: string) => Response;

const useSetReadyEvent = (
    gameService: GameService
): SetReadyEvent => {
    return (playerId) => {
        const getPlayerRes: Response<Player> = gameService.getPlayer(playerId);

        if (!getPlayerRes.data) {
            return getPlayerRes as Response;
        }

        const player: Player = getPlayerRes.data;

        if (!(player instanceof LobbyPlayer)) {
            return {
                success: false,
                message: "Cannot change ready state once game has started."
            }
        }

        const getGameRes: Response<Game> = gameService.getGame(player.gameCode);
    
        if (!getGameRes.data) {
            return getGameRes as Response;
        }

        const game: Game = getGameRes.data;

        // if (!game || (game.state !== 'waiting' && game.state !== 'starting')) {
        //     return {
        //         success: false,
        //         message: "Cannot change ready state once game has started."
        //     }
        // }

        // mark the player as ready
        player.ready = true;
        game.playersReady += 1;
        gameService.emitToGame('game:playerReadyChange', player.gameCode, { playerId, newReadyState: true });

        // start the game if all players are ready
        if (game.players.size > 1 && game.playersReady === game.players.size) {
            gameService.startGameCountdown(game);
        } else if (game.state === 'starting') {
            gameService.stopGameCountdown(game);
        }

        return {
            success: true,
            message: "Set player's ready status to true."
        };
    }
};

export default useSetReadyEvent;