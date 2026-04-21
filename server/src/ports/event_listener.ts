import Response from "../../../shared/response";

export type EventHandler<T> = (playerId: string, data?: any) => void | Response<T>;

/** A function that initializes event handlers on a given event listener */
export type EventBinder = (eventListener: EventListenerService) => void;

/** An event handler service associated with a player */
export interface EventListenerService {
    /** Listens to an event and data that was emitted by a player */
    listen: <T>(eventName: string, eventHandler: EventHandler<T>) => void;
    /** Subscribes a player to a game */
    subscribe: (gameCode: string) => void;
    /** Unsubscribes a player from a game */
    unsubscribe: (gameCode: string) => void;
}
