import { GameConnectionData, GameState } from "../../../server/src/models/game";
import { Player } from "../../../server/src/models/player";
import { ConjugationRaceIO } from "./conjugation_race";

/** An object containing event listeners and emitters to process game state */
export interface GameIO {
    getGlobalIO: () => GlobalIO;
    getLobbyIO: () => GameLobbyIO;
    getActiveIO: () => GameActiveIO;
}

export interface GlobalIO {
    /** An event listener that notifies the player that another player has joined */
    onPlayerJoin(handlePlayerJoin: ((player: Player) => void)): void;
    /** An event listener that notifies the player that another player has quit */
    onPlayerQuit(handlePlayerQuit: ((player: Player) => void)): void;
    /** An event listener that notifies the player that the game state has changed */
    onGameStateChange(handleGameStateChange: ((newState: GameState) => void)): void;
    /** An event listener that notifies the player that the counter has changed */
    onCounterChange(handleCounterChange: ((newCounterValue: number) => void)): void;
    /** An event listener that notifies the player that the game has been destroyed abruptly */
    onGameDestroy(handleGameDestroy: () => void): void;
}

export interface GameLobbyIO {
    /** An event emitter that sets the player ready's state to true */
    emitSetReady: () => void;
    /** An event listener that notifies the player of any ready state changes */
    onPlayerReadyChange(handlePlayerReadyChange: ((playerId: string, newReadyState: boolean) => void)): void;
}

export interface GameActiveIO {
    getConjugationRaceIO: () => ConjugationRaceIO;
}

/** An object that contains information about a game relative to a given player. */
export interface GameContext {
    getInitialGameData: () => GameConnectionData;
    getIO: () => GameIO;
}