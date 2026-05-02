import { Player as PlayerShape, LobbyPlayer as LobbyPlayerShape } from "../../../../../shared/player";

// Classes exist so we can check types during runtime via instanceof
export class Player implements PlayerShape {
    id: string;
    gameCode: string;
    username: string;

    constructor(id: string, gameCode: string, username: string) {
        this.id = id;
        this.gameCode = gameCode;
        this.username = username;
    }
}

export class LobbyPlayer extends Player implements LobbyPlayerShape {
    ready: boolean = false;
}
