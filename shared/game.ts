import { LobbyPlayer } from "./player";
import { Tense } from "./tenses";

export type GameState = 'waiting' | 'starting' | 'active' | 'ending';

/** The data that a player will receive when they join a game */
export interface GameConnectionData {
    state: GameState;
    initialPlayers: LobbyPlayer[];
    playerId: string;
    settings: GameSettings;
}

export interface GameSettings {
    mode: string;
    tenses: Tense[];
    duration: Duration;
    maxPlayers: number;
}

export interface Duration {
    minutes: number;
    seconds: number;
}

export const gameModes = [
    'conjugation-race'
];

export type GameMode = typeof gameModes[number];
