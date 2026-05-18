import { Socket } from "socket.io";
import { EventEmitter } from "events";
import { Ack, ClientPayload, ClientToServerEvents, EmitResponse } from "@verbatim/shared/events";
import { EventListener, EventListenerService } from "../../ports/event_listener";

/** Uses the Socket IO implementation for handling bi-directional events */
export const createSocketIOEventListener = (socket: Socket): EventListenerService => {
    const emitter = socket as EventEmitter;
    const playerId = socket.id;

    return {
        listen<K extends keyof ClientToServerEvents>(eventName: K, eventListener: EventListener<K>): void {
            type R = EmitResponse<ClientToServerEvents[K]>;
            // Create wrapper listener to extract payload and run ack callback for socket.io
            const listener = (data: ClientPayload<ClientToServerEvents[K]>, ack: Ack<R>) => {
                const response = eventListener(playerId, data);
                if (!ack || typeof ack !== 'function') {
                    return;
                }
                if (response !== undefined) {
                    ack(response as R);
                }
            };
            emitter.on(eventName, listener);
        },
        onDisconnect(handler) {
            emitter.on('disconnect', () => handler(playerId));
        },
        subscribe(gameCode: string) {
            socket.join(gameCode);
        },
        unsubscribe(gameCode: string) {
            socket.leave(gameCode);
        },
    };
};
