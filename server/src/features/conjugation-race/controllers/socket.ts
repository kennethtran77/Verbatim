import { EventBinder, EventListenerService } from "../../../ports/event_listener";
import { ConjugationRaceEvents } from "..";

export const createConjugationRaceEventBinder = (
    events: ConjugationRaceEvents
): EventBinder => (eventListener: EventListenerService) => {
    eventListener.listen('game:conjugationRace:submitAnswer', (playerId, answer) => {
        return events.handleSubmitAnswer(playerId, answer);
    });
};
