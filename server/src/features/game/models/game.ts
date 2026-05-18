import { LobbyPlayer, Player } from "./player";
import { Duration, GameSettings, GameState } from "@verbatim/shared/game";
import { EventEmitterService } from "../../../ports/event_emitter";

export { GameState, GameConnectionData, GameSettings, Duration, gameModes, GameMode } from "@verbatim/shared/game";

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
    state: GameState = 'waiting';
    counter: number = 10;
    players: Set<Player> = new Set();
    playersReady: number = 0;
    settings: GameSettings;
    startTime: Date;
    endTime: Date;

    constructor(
        protected eventEmitter: EventEmitterService,
        code: string,
        settings: GameSettings,
    ) {
        this.code = code;
        this.settings = settings;
    }

    /** Update game state and notify listeners */
    setState(newState: GameState) {
        this.state = newState;
        this.eventEmitter.emit('game:stateChange', this.code, newState);
    }

    /** Update the countdown counter and notify listeners */
    setCounter(newCounter: number) {
        this.counter = newCounter;
        this.eventEmitter.emit('game:counterChange', this.code, newCounter);
    }

    /** Add a player to the game and notify other players */
    addPlayer(player: Player) {
        this.players.add(player);
        this.eventEmitter.emit('game:playerJoined', this.code, player);
    }

    /** Remove a player from the game and notify other players. Returns the removed player, or null */
    removePlayer(playerId: string): Player | null {
        const player = [...this.players].find(p => p.id === playerId);
        if (!player) return null;

        if (player instanceof LobbyPlayer && player.ready) {
            this.playersReady -= 1;
        }
        this.players.delete(player);
        this.eventEmitter.emit('game:playerQuit', this.code, player);
        return player;
    }

    /** Mark a lobby player as ready and notify listeners. Returns true if state changed */
    markPlayerReady(playerId: string): boolean {
        const player = [...this.players].find(p => p.id === playerId);
        if (!(player instanceof LobbyPlayer) || player.ready) return false;

        player.ready = true;
        this.playersReady += 1;
        this.eventEmitter.emit('game:playerReadyChange', this.code, { playerId, newReadyState: true });
        return true;
    }

    /** True when there are at least 2 players and all are ready */
    allPlayersReady(): boolean {
        return this.players.size > 1 && this.playersReady === this.players.size;
    }

    /** Notify listeners that this game is being destroyed. */
    notifyDestroyed() {
        this.eventEmitter.emit('game:destroy', this.code);
    }

    /** Called when the game transitions from 'starting' to 'active'. */
    onStart(_convertedPlayers: Player[]) {
        this.startTime = new Date();
        this.setCounter(this.settings.duration.minutes * 60 + this.settings.duration.seconds);

        const timer: NodeJS.Timeout = setInterval(() => {
            if (this.state !== 'active') {
                clearInterval(timer);
                return;
            }

            if (this.counter === 1) {
                clearInterval(timer);
                this.setState('ending');
                this.onEnd();
                return;
            }

            this.setCounter(this.counter - 1);
        }, 1000);
    }

    /** Called when the game transitions to 'ending' */
    onEnd() {
        this.endTime = new Date();
    }
}
