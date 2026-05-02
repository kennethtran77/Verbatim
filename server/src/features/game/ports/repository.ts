import { Game, GameData } from "../models/game";

export interface GameRepository {
    saveGameData: (game: Game) => Promise<void>;
    getGameData: (gameCode: string) => Promise<GameData | null>;
}
