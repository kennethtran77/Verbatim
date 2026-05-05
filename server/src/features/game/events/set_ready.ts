import { Game } from "../models/game";
import { LobbyPlayer, Player } from "../models/player";
import Response from "../../../../../shared/response";
import { LiveGameService } from "../services/live_game_service";
import { LiveGameRepository } from "../services/live_repository";

export type SetReadyEvent = (playerId: string) => Response;

const createSetReadyEvent = (
    liveGameService: LiveGameService,
    liveRepository: LiveGameRepository,
): SetReadyEvent => {
    return (playerId) => {
        const getPlayerRes: Response<Player> = liveRepository.getPlayer(playerId);

        if (!getPlayerRes.data) {
            return getPlayerRes as Response;
        }

        const player: Player = getPlayerRes.data;

        if (!(player instanceof LobbyPlayer)) {
            return {
                success: false,
                message: "Cannot change ready state once game has started.",
            };
        }

        const getGameRes: Response<Game> = liveRepository.getGame(player.gameCode);

        if (!getGameRes.data) {
            return getGameRes as Response;
        }

        const game: Game = getGameRes.data;

        game.markPlayerReady(playerId);

        if (game.allPlayersReady()) {
            liveGameService.startGameCountdown(game);
        } else if (game.state === 'starting') {
            liveGameService.stopGameCountdown(game);
        }

        return {
            success: true,
            message: "Set player's ready status to true.",
        };
    };
};

export default createSetReadyEvent;
