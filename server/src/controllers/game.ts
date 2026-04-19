import { GameDbService } from "../services/global/game_db";
import Request, { RequestHandlerService } from "../services/global/request_handler";

/** A function that initializes REST controllers given a request handler service */
export type RestController = (requestHandler: RequestHandlerService) => void;

const useGameRestController = (
    gameDbService: GameDbService,
): RestController => (requestHandler: RequestHandlerService) => {
    const getGameData = async (request: Request) => {
        const game = await gameDbService.getGameData(request.pathParams.code);
        if (game) {
            return { success: true, message: 'Game found', data: game };
        }

        return { success: false, message: 'Game not found' };
    }

    requestHandler.get('/', async () => {
        return { success: true, message: 'API is running' };
    });
    requestHandler.get('/:code', getGameData);
};

export default useGameRestController;
