import { GlobalServices } from "../services";
import { ConjugationRaceEvents, ConjugationRaceServices } from "../services/active/conjugation_race";
import { EventListenerService } from "../services/global/event_listener";
import { Controller } from "./global";

const useConjugationRaceGame = (
    globalServices: GlobalServices,
    conjugationRaceServices: ConjugationRaceServices,
    events: ConjugationRaceEvents
): Controller => (eventListener: EventListenerService) => {
    
    eventListener.listen('game:conjugationRace:submitAnswer', (playerId, answer) => {
        return events.handleSubmitAnswer(playerId, answer);
    });

    return eventListener;
}

export default useConjugationRaceGame;