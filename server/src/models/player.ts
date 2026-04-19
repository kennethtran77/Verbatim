import { VerbResponse } from "./conjugation_race";

// need classes so that we can check types during runtime
export class Player {
    id: string;
    gameCode: string;
    username: string;
}

export class LobbyPlayer extends Player {
  ready: boolean;
}

export class ConjugationRacePlayer extends Player {
    verbResponses: VerbResponse[];
    verbsSeen: number;
    verbsCorrect: number;
    verbsIncorrect: number;
};