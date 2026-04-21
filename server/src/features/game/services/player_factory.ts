import { GameMode } from "../models/game";
import { LobbyPlayer, Player } from "../models/player";
import { ConjugationRacePlayer } from "../../conjugation-race/models/player";
import Response from "../../../../../shared/response";

export type PlayerFactory = (playerId: string, gameCode: string, username: string, mode: GameMode | 'lobby') => Response<Player>;

const createPlayerFactory = (
    createLobbyPlayer: (player: Player) => LobbyPlayer,
    createConjugationRacePlayer: (player: Player) => ConjugationRacePlayer,
): PlayerFactory => {
    return (playerId, gameCode, username, mode) => {
        let newPlayer: Player = {
            id: playerId,
            gameCode,
            username
        };

        switch (mode) {
            case 'lobby':
                newPlayer = createLobbyPlayer(newPlayer);
                break;
            case 'conjugation-race':
                newPlayer = createConjugationRacePlayer(newPlayer);
                break;
            default:
                break;
        }

        return {
            success: true,
            message: "Created new player",
            data: newPlayer
        }
    }
}

export default createPlayerFactory;