import { LeaderboardValue, Verb } from "../conjugation_race";
import Response from "../response";
import type { ClientRequest } from ".";

export interface ConjugationRaceClientToServerEvents {
    'game:conjugationRace:submitAnswer': ClientRequest<string, Response<Verb>>;
}

export interface ConjugationRaceServerToClientEvents {
    'game:conjugationRace:leaderboardChange': (leaderboard: LeaderboardValue[]) => void;
    'game:conjugationRace:verbsSeenChange': (verbsSeen: number) => void;
    'game:conjugationRace:verbsCorrectChange': (verbsCorrect: number) => void;
    'game:conjugationRace:verbsIncorrectChange': (payload: { correctAnswer: string; newVerbsIncorrect: number }) => void;
    'game:conjugationRace:gameStart': (firstVerb: Verb) => void;
}
