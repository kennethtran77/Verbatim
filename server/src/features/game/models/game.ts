import { Player } from "./player";
import { Duration, GameSettings, GameState } from "../../../../../shared/game";
import { EventEmitterService } from "../../../ports/event_emitter";

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

    /** Update game state and notify listeners. */
    setState(newState: GameState) {
        this.state = newState;
        this.eventEmitter.emit('game:stateChange', this.code, newState);
    }

    /** Update the countdown counter and notify listeners. */
    setCounter(newCounter: number) {
        this.counter = newCounter;
        this.eventEmitter.emit('game:counterChange', this.code, newCounter);
    }

    /** Called when the game transitions from 'starting' to 'active'. */
    onStart(_convertedPlayers: Player[]) {
        this.startTime = new Date();
        this.setCounter(this.settings.duration.minutes * 60 + this.settings.duration.seconds);

        const timer: NodeJS.Timer = setInterval(() => {
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

    /** Called when the game transitions to 'ending'. */
    onEnd() {
        this.endTime = new Date();
    }
}
