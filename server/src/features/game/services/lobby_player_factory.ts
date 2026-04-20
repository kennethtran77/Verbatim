import { LobbyPlayer, Player } from "../models/player";

export type LobbyPlayerFactory = (player: Player) => LobbyPlayer;

export const createLobbyPlayerFactory = (): LobbyPlayerFactory => {
    return (player) =>
        Object.setPrototypeOf(
        {
            ...player,
            ready: false
        },
        LobbyPlayer.prototype
    )
};