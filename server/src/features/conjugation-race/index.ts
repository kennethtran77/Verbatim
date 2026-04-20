import { GameServices } from "../game";
import useSubmitAnswerEvent, { SubmitAnswerEvent } from "./events/submit_answer";
import { ConjugationRaceDbService } from "./services/db";
import useVerbService, { VerbService } from "./services/verb_service";

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
    dbService,
});

export const useConjugationRaceEvents = (gameServices: GameServices, conjugationRaceServices: ConjugationRaceServices): ConjugationRaceEvents => ({
    handleSubmitAnswer: useSubmitAnswerEvent(gameServices.gameService, conjugationRaceServices),
});
