import { GameContext } from "../game";
import createSubmitAnswerEvent, { SubmitAnswerEvent } from "./events/submit_answer";

export interface ConjugationRaceEvents {
    handleSubmitAnswer: SubmitAnswerEvent;
}

export const createConjugationRaceEvents = (
    gameContext: GameContext,
): ConjugationRaceEvents => ({
    handleSubmitAnswer: createSubmitAnswerEvent(gameContext.gameService),
});
