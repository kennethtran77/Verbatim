import { GameContext } from "../game";
import createSubmitAnswerEvent, { SubmitAnswerEvent } from "./events/submit_answer";
import { ConjugationRaceRepository } from "./ports/repository";
import createVerbService, { VerbService } from "./services/verb_service";

export interface ConjugationRaceServices {
    verbService: VerbService;
    repository: ConjugationRaceRepository;
}

export interface ConjugationRaceEvents {
    handleSubmitAnswer: SubmitAnswerEvent;
}

export const createConjugationRaceServices = (
    repository: ConjugationRaceRepository,
): ConjugationRaceServices => {
    const verbService = createVerbService();    
    return {
        verbService,
        repository
    };
};

export const createConjugationRaceEvents = (gameContext: GameContext, conjugationRaceServices: ConjugationRaceServices): ConjugationRaceEvents => ({
    handleSubmitAnswer: createSubmitAnswerEvent(gameContext.gameService, conjugationRaceServices),
});
