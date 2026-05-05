import { GameState } from "../models/game";
import Response from "../../../../../shared/response";
import { LiveGameRepository } from "../services/live_repository";

export type GetGameStatusEvent = (gameCode: string) => Response<GameState>;

const createGetGameStatusEvent = (liveRepository: LiveGameRepository): GetGameStatusEvent => {
    return (gameCode) => {
        const getGameRes = liveRepository.getGame(gameCode);
        const game = getGameRes.data;

        if (!game) {
            return {
                success: false,
                message: getGameRes.message,
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
            }
        };

        return {
            success: true,
            message: getStateMessage(),
            data: game.state,
        };
    };
};

export default createGetGameStatusEvent;
