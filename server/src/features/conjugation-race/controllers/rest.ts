import Request, { RequestHandlerService, RouteBinder } from "../../../ports/request_handler";
import { ConjugationRaceRepository } from "../ports/repository";

export const createConjugationRaceRouteBinder = (
    repository: ConjugationRaceRepository,
): RouteBinder => (requestHandler: RequestHandlerService) => {
    requestHandler.get('/', async () => {
        return { success: true, message: 'API is running' };
    });
    requestHandler.get('/:code/player/:playerId/responses', async (request: Request) => {
        const { code, playerId } = request.pathParams;
        const verbResponses = await repository.getPlayerVerbResponses(code, playerId);
        return { success: true, message: 'Verb responses retrieved', data: verbResponses };
    });
    requestHandler.get('/:code/history', async (request: Request) => {
        const { code } = request.pathParams;
        const gameHistory = await repository.getGameHistory(code);
        return { success: true, message: 'Game history retrieved', data: gameHistory };
    });
};
