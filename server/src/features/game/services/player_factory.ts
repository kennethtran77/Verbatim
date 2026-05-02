import { GameMode } from "../models/game";
import { Player } from "../models/player";
import Response from "../../../../../shared/response";
import { LobbyPlayerFactory } from "./lobby_player_factory";
import { ConjugationRacePlayerFactory } from "../../conjugation-race/services/player_factory";

export type PlayerFactory = (playerId: string, gameCode: string, username: string, mode: GameMode | 'lobby') => Response<Player>;

const createPlayerFactory = (
    createLobbyPlayer: LobbyPlayerFactory,
    createConjugationRacePlayer: ConjugationRacePlayerFactory,
): PlayerFactory => {
    return (playerId, gameCode, username, mode) => {
        let newPlayer: Player;

        switch (mode) {
            case 'lobby':
                newPlayer = createLobbyPlayer(playerId, gameCode, username);
                break;
            case 'conjugation-race':
                newPlayer = createConjugationRacePlayer(playerId, gameCode, username);
                break;
            default:
                newPlayer = new Player(playerId, gameCode, username);
                break;
        }

        return {
            success: true,
            message: "Created new player",
            data: newPlayer,
        };
    };
};

export default createPlayerFactory;
