import { GameState, GameSettings, Duration } from "../../../../../shared/game";
import { GameService } from "../services/game_service";
import { Player } from "./player";

export { GameState, GameConnectionData, GameSettings, Duration, gameModes, GameMode } from "../../../../../shared/game";

export class GameData {
    code: string;
    mode: string;
    tenses: string[];
    duration: Duration;
    maxPlayers: number;
    startTime: Date;
    endTime: Date;
}

export class Game {
    code: string;
    state: GameState;
    counter: number;
    players: Set<Player>;
    playersReady: number;
    settings: GameSettings;
    startTime: Date;
    endTime: Date;
    /** Callback functions that are executed on respective game state change */
    onStart: (gameService: GameService) => any;
    onEnd: (gameService: GameService) => any;
}
