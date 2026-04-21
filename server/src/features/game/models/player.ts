import { Player as PlayerShape, LobbyPlayer as LobbyPlayerShape } from "../../../../../shared/player";

// Classes exist so we can check types during runtime via instanceof
export class Player implements PlayerShape {
    id: string;
    gameCode: string;
    username: string;
}

export class LobbyPlayer extends Player implements LobbyPlayerShape {
    ready: boolean;
}
