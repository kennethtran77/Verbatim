import { Verb } from "../../../server/src/models/conjugation_race";
import Response from "../../../server/src/models/response";

export interface LeaderboardValue {
    playerName: string;
    score: number;
}

export interface ConjugationRaceIO {
    /** An event listener that notifies the player that the leaderboard has changed */
    onLeaderboardChange(handleLeaderboardChange: ((orderedNames: LeaderboardValue[]) => void)): void;
    /** An event listener that notifies the player that their verbs seen has changed */
    onVerbsSeenChange(handleVerbsSeenChange: ((verbsSeen: number) => void)): void;
    /** An event listener that notifies the player that their verbs correct has changed */
    onVerbsCorrectChange(handleVerbsCorrectChange: ((verbsCorrect: number) => void)): void;
    /** An event listener that notifies the player that their verbs incorrect has changed */
    onVerbsIncorrectChange(handleVerbsIncorrectChange: ((correctAnswer: string, verbsIncorrect: number) => void)): void;
    onGameStart(handleGameStart: ((firstVerb: Verb) => void)): void;
    emitSubmitAnswer: (answer: string) => Promise<Response<Verb>>;
}