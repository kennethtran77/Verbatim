// Dependencies for conjugation race

import { GlobalServices } from "../..";
import useSubmitAnswerEvent, { SubmitAnswerEvent } from "../../../events/active/conjugation_race/submit_answer";
import { ConjugationRaceDbService } from "./conjugation_race_db";
import useVerbService, { VerbService } from "./verb_service";

export interface ConjugationRaceServices {
    getVerbService: () => VerbService;
    dbService: ConjugationRaceDbService;
}

export interface ConjugationRaceEvents {
    handleSubmitAnswer: SubmitAnswerEvent;
}

export const useConjugationRaceServices = (
    dbService: ConjugationRaceDbService,
): ConjugationRaceServices => ({
    getVerbService: useVerbService,
    dbService
});

export const useConjugationRaceEvents = (globalServices: GlobalServices, conjugationRaceServices: ConjugationRaceServices): ConjugationRaceEvents => ({
    handleSubmitAnswer: useSubmitAnswerEvent(globalServices.gameService, conjugationRaceServices)
});