import { Namespace, Socket } from "socket.io";
import Response from "../../../../shared/response";
import { EventHandler, EventListenerService } from "../../ports/event_listener";

/** Uses the Socket IO implementation for handling bi-directional events */
export const createSocketIOEventListener = (io: Namespace, socket: Socket): EventListenerService => ({
    listen: <T>(eventName: string, eventHandler: EventHandler<T>) => {
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
    },
});
