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
    verbsSeen: number;
    verbsCorrect: number;
    verbsIncorrect: number;
};