import { Tense } from "../tenses";

export interface LeaderboardValue {
    playerName: string;
    score: number;
}

export interface Verb {
    infinitive: string;
    tense: Tense;
    subject: Subject;
    pronominal: boolean;
}

/** Represents a user's submitted input to a verb question. */
export interface VerbResponse {
    verb: string;
    input: string;
    correctAnswer: string;
    isInputCorrect: boolean;
    answerTime: Date;
}

export type Subject = 'je' | 'tu' | 'il' | 'elle' | 'on' | 'nous' | 'vous' | 'ils' | 'elles';
