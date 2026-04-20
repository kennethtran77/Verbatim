import { GameDbService } from "../services/game_db";
import Request, { RequestHandlerService, RouteBinder } from "../../../ports/request_handler";

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
