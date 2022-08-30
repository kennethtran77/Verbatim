import { GameState } from "../../models/game";
import Response from "../../models/response";
import { GameService } from "../../services/global/game_service";

export type GetGameStatusEvent = (gameCode: string) => Response<GameState>;

const useGetGameStatusEvent = (gameService: GameService): GetGameStatusEvent => {
    return (gameCode) => {
        const getGameRes = gameService.getGame(gameCode);
        const game = getGameRes.data;

        if (!game) {
            return {
                success: false,
                message: getGameRes.message
            };
        }

        const getStateMessage = () => {
            switch (game.state) {
                case "waiting":
                    return "The game is accepting players.";
                case "starting":
                case "active":
                    return "The game has already started.";
                case "ending":
                    return "The game is currently ending.";
            };
        };

        return {
            success: true,
            message: getStateMessage(),
            data: game.state
        };
    }
};

export default useGetGameStatusEvent;