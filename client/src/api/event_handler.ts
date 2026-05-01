import { Socket } from "socket.io-client";
import {
    ClientToServerEvents,
    EmitParams,
    EmitResponse,
    ServerToClientEvents,
} from "../../../shared/events";

export interface EventHandler {
    /** Emits an event and returns the server's ack response */
    emit<K extends keyof ClientToServerEvents>(
        eventName: K,
        ...args: EmitParams<ClientToServerEvents[K]>
    ): Promise<EmitResponse<ClientToServerEvents[K]>>;
    /** Attaches a listener for a server-emitted event */
    listen<K extends keyof ServerToClientEvents>(
        eventName: K,
        listener: ServerToClientEvents[K]
    ): void;
    /** Removes all listeners for a server-emitted event */
    unlisten<K extends keyof ServerToClientEvents>(eventName: K): void;
}

/** Minimal view of socket.io-client's inherited emitter methods */
interface RawEmitter {
    emit(event: string, ...args: any[]): void;
    on(event: string, listener: (...args: any[]) => void): void;
    off(event: string): void;
}

export const initSocketIOEventHandler = (
    socket: Socket<ServerToClientEvents, ClientToServerEvents>
): EventHandler => {
    const emitter = socket as RawEmitter;

    return {
        emit(eventName, ...args) {
            return new Promise((resolve) => {
                // emits an event and expects a response in a callback
                const payload = args.length > 0 ? args[0] : undefined;
                emitter.emit(eventName, payload, resolve);
            });
        },
        listen(eventName, listener) {
            emitter.on(eventName, listener);
        },
        unlisten(eventName) {
            emitter.off(eventName);
        },
    };
};
