import { GameServices } from "../game";
import createSubmitAnswerEvent, { SubmitAnswerEvent } from "./events/submit_answer";
import { ConjugationRaceDbService } from "./services/db";
import createVerbService, { VerbService } from "./services/verb_service";

export interface ConjugationRaceServices {
    getVerbService: () => VerbService;
    dbService: ConjugationRaceDbService;
}

export interface ConjugationRaceEvents {
    handleSubmitAnswer: SubmitAnswerEvent;
}

export const createConjugationRaceServices = (
    dbService: ConjugationRaceDbService,
): ConjugationRaceServices => ({
    getVerbService: createVerbService,
    dbService,
});

export const createConjugationRaceEvents = (gameServices: GameServices, conjugationRaceServices: ConjugationRaceServices): ConjugationRaceEvents => ({
    handleSubmitAnswer: createSubmitAnswerEvent(gameServices.gameService, conjugationRaceServices),
});
