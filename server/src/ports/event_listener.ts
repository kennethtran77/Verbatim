import {
    ClientToServerEvents,
    ClientRequest,
    ClientRequestNoPayload,
} from "../../../shared/events";

/** A handler for a client-to-server event, scoped to the emitting player */
export type EventListener<K extends keyof ClientToServerEvents> =
    ClientToServerEvents[K] extends ClientRequestNoPayload<infer R> ? (playerId: string) => void | R :
    ClientToServerEvents[K] extends ClientRequest<infer P, infer R> ? (playerId: string, payload: P) => void | R :
    never;

/** A function that initializes event handlers on a given event listener */
export type EventBinder = (eventListener: EventListenerService) => void;

/** An event handler service associated with a player */
export interface EventListenerService {
    /** Listens to an event and data that was emitted by a player */
    listen<K extends keyof ClientToServerEvents>(eventName: K, eventHandler: EventListener<K>): void;
    /** Handles disconnection of a player */
    onDisconnect: (handler: (playerId: string) => void) => void;
    /** Subscribes a player to a game */
    subscribe: (gameCode: string) => void;
    /** Unsubscribes a player from a game */
    unsubscribe: (gameCode: string) => void;
}
