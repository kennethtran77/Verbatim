import { Player } from "../../game/models/player";
import { VerbResponse } from "./conjugation_race";

export class ConjugationRacePlayer extends Player {
    verbResponses: VerbResponse[] = [];
    verbsSeen: number = 1;
    verbsCorrect: number = 0;
    verbsIncorrect: number = 0;
}
