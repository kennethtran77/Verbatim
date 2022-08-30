import { LobbyPlayer, Player } from "../../models/player";

export type LobbyPlayerFactory = (player: Player) => LobbyPlayer;

export const useLobbyPlayerFactory = (): LobbyPlayerFactory => {
    return (player) =>
        Object.setPrototypeOf(
        {
            ...player,
            ready: false
        },
        LobbyPlayer.prototype
    )
};