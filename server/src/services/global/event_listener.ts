import { Namespace, Socket } from "socket.io";
import Response from "../../models/response";

/** An event handler service associated with a player */
export interface EventListenerService {
    /** Listens to an event and data that was emitted by a player */
    listen: <T>(eventName: string, eventHandler: ((playerId: string, data?: any) => void | Response<T>)) => void;
    /** Subscribes a player to a game */
    subscribe: (gameCode: string) => void;
    /** Unsubscribes a player from a game */
    unsubscribe: (gameCode: string) => void;
}

/** Uses the Socket IO implementation for handling bi-directional events */
export const useSocketIOEventListener = (io: Namespace, socket: Socket): EventListenerService => ({
    listen: <T>(eventName: string, eventHandler: (playerId: string, data?: any) => void | Response<T>) => {
        // socket takes a data object and a callback function
        socket.on(eventName, (data: any, sendResponse: (res: Response<T>) => void) => {
            const eventResponse = eventHandler(socket.id, data);
            
            if (!sendResponse || typeof sendResponse !== 'function')
                return;

            if (eventResponse)
                sendResponse(eventResponse);
        });
    },
    subscribe: (gameCode: string) => {
        io.in(socket.id).socketsJoin([gameCode]);
    },
    unsubscribe: (gameCode: string) => {
        io.in(socket.id).socketsLeave([gameCode]);
    }
});