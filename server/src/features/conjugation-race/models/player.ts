import { Player } from "../../game/models/player";
import { VerbResponse } from "./conjugation_race";

export class ConjugationRacePlayer extends Player {
    verbResponses: VerbResponse[];
    verbsSeen: number;
    verbsCorrect: number;
    verbsIncorrect: number;
}
