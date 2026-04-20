import Request, { RequestHandlerService, RouteBinder } from "../../../ports/request_handler";
import { ConjugationRaceDbService } from "../services/db";

export const createConjugationRaceRouteBinder = (
    dbService: ConjugationRaceDbService,
): RouteBinder => (requestHandler: RequestHandlerService) => {
    requestHandler.get('/', async () => {
        return { success: true, message: 'API is running' };
    });
    requestHandler.get('/:code/player/:playerId/responses', async (request: Request) => {
        const { code, playerId } = request.pathParams;
        const verbResponses = await dbService.getPlayerVerbResponses(code, playerId);
        return { success: true, message: 'Verb responses retrieved', data: verbResponses };
    });
};
