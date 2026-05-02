import { LobbyPlayer } from "../models/player";

export type LobbyPlayerFactory = (id: string, gameCode: string, username: string) => LobbyPlayer;

export const createLobbyPlayerFactory = (): LobbyPlayerFactory =>
    (id, gameCode, username) => new LobbyPlayer(id, gameCode, username);
