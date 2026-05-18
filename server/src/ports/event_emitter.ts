import { ServerToClientEvents } from "@verbatim/shared/events";

/** Emits an event with data to all players in a game */
export interface EventEmitterService {
    emit<K extends keyof ServerToClientEvents>(
        eventName: K,
        gameCode: string,
        ...args: Parameters<ServerToClientEvents[K]>
    ): void;
}
