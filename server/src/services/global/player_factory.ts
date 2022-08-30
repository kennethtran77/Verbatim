import { GameMode } from "../../models/game";
import { ConjugationRacePlayer, LobbyPlayer, Player } from "../../models/player";
import Response from "../../models/response";

export type PlayerFactory = (playerId: string, gameCode: string, username: string, mode: GameMode | 'lobby') => Response<Player>;

const usePlayerFactory = (
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

export default usePlayerFactory;