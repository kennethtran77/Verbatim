// Dependencies for conjugation race

import { GlobalServices } from "../..";
import useSubmitAnswerEvent, { SubmitAnswerEvent } from "../../../events/active/conjugation_race/submit_answer";
import useVerbService, { VerbService } from "./verb_service";

export interface ConjugationRaceServices {
    getVerbService: () => VerbService;
}

export interface ConjugationRaceEvents {
    handleSubmitAnswer: SubmitAnswerEvent;
}

export const useConjugationRaceServices = (): ConjugationRaceServices => ({
    getVerbService: useVerbService
});

export const useConjugationRaceEvents = (globalServices: GlobalServices, conjugationRaceServices: ConjugationRaceServices): ConjugationRaceEvents => ({
    handleSubmitAnswer: useSubmitAnswerEvent(globalServices.gameService, conjugationRaceServices)
});