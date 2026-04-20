import { GameDbService } from "../services/global/game_db";
import Request, { RequestHandlerService } from "../services/global/request_handler";

/** A function that initializes REST routes given a request handler service */
export type RouteBinder = (requestHandler: RequestHandlerService) => void;

const createGameRouteBinder = (
    gameDbService: GameDbService,
): RouteBinder => (requestHandler: RequestHandlerService) => {
    requestHandler.get('/', async () => {
        return { success: true, message: 'API is running' };
    });
    requestHandler.get('/:code', async (request: Request) => {
        const game = await gameDbService.getGameData(request.pathParams.code);
        if (game) {
            return { success: true, message: 'Game found', data: game };
        }

        return { success: false, message: 'Game not found' };
    });
};

export default createGameRouteBinder;
