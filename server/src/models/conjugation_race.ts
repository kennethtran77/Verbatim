import { Tense } from "../../../client/src/models/tenses";
import { Game } from "./game";
import { ConjugationRacePlayer } from "./player";

export class ConjugationRaceGame extends Game {
    /** A list of players sorted by verbs most correctly answered */
    leaderboard: ConjugationRacePlayer[];
    verbList: Verb[];
}

export interface Verb {
    infinitive: string;
    tense: Tense;
    subject: Subject;
    pronominal: boolean;
}

export type Subject = 'je' | 'tu' | 'il' | 'elle' | 'on' | 'nous' | 'vous' | 'ils' | 'elles';