import { Game } from "../../models/game";
import { Player } from "../../models/player";
import Response from "../../models/response";

/** Holds players and games and ways to add, remove, and fetch them. */
export interface GameRepository {
    /** Add a player to the game store. Returns whether add was successful. */
    addPlayer: (player: Player) => Response;
    /** Removes a player from the game store. Returns whether remove was successful. */
    removePlayer: (playerId: string) => Response;
    /** Add a game to the game store. Returns whether add was successful. */
    addGame: (game: Game) => Response;
    /** Removes a game from the game store. Returns whether remove was successful. */
    removeGame: (gameCode: string) => Response;
    getPlayer: (playerId: string) => Response<Player>;
    getGame: (gameCode: string) => Response<Game>;
}

/** Returns a GameStore that uses memory and the Map data structure. */
const useMemGameRepository = (): GameRepository => {
    /** A map of active games */
    const games: Map<string, Game> = new Map();
    /** A map of player ids to player objects */
    const players: Map<string, Player> = new Map();

    return {
        addPlayer: (player: Player) => {
            players.set(player.id, player);

            return {
                success: true,
                message: "Successfully added player."
            };
        },
        removePlayer: (playerId: string) => {
            const success = players.delete(playerId);

            return {
                success,
                message: success ? "Successfully deleted player." : "No player with the given id exists."
            }
        },
        addGame: (game: Game) => {
            games.set(game.code, game);

            return {
                success: true,
                message: "Successfuly added game."
            };
        },
        removeGame: (gameCode: string) => {
            const success = games.delete(gameCode);

            return {
                success,
                message: success ? "Successfully deleted game." : "No game with the given code exists."
            }
        },
        getPlayer: (playerId) => {
            const player = players.get(playerId);

            if (!player) {
                return {
                    success: false,
                    message: "No player with the given id exists.",
                };
            }
    
            return {
                success: true,
                message: "Successfully fetched player.",
                data: player
            };
        },
        getGame: (gameCode) => {
            const game = games.get(gameCode);

            if (!game) {
                return {
                    success: false,
                    message: "No game with the given code exists.",
                };
            }
    
            return {
                success: true,
                message: "Successfully fetched game.",
                data: game
            };
        }
    };
};

export default useMemGameRepository;