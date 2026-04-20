import { ConjugationRaceEvents } from "../services/active/conjugation_race";
import { EventListenerService } from "../services/global/event_listener";
import { RequestHandlerService } from "../services/global/request_handler";
import { RouteBinder } from "./game";
import { EventBinder } from "./global";
import Request from "../services/global/request_handler";
import { ConjugationRaceDbService } from "../services/active/conjugation_race/conjugation_race_db";

export const createConjugationRaceEventBinder = (
    events: ConjugationRaceEvents
): EventBinder => (eventListener: EventListenerService) => {
    eventListener.listen('game:conjugationRace:submitAnswer', (playerId, answer) => {
        return events.handleSubmitAnswer(playerId, answer);
    });
}

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
