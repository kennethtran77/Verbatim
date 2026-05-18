export interface Player {
    id: string;
    gameCode: string;
    username: string;
}

export interface LobbyPlayer extends Player {
    ready: boolean;
}
