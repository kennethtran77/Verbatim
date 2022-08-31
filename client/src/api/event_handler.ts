import { Socket } from "socket.io-client";
import Response from "../../../server/src/models/response";

export interface EventHandler {
    /** Emits an event and returns a response from the server */
    emit: <T>(eventName: string, data?: Object) => Promise<Response<T>>;
    /** Attaches an event listener function to handle an event emitted by the server */
    listen: (eventName: string, listener: (...args: any[]) => void) => void;
    /** Unattaches an event listener function */
    unlisten: (eventName: string) => void;
}

export const initSocketIOEventHandler = (socket: Socket): EventHandler => {
    return {
        emit<T>(eventName: string, data?: Object) {
            return new Promise<Response<T>>((resolve) => {
                // emits an event and expects a response in a callback
                socket.emit(eventName, data, (response: Response<T>) => resolve(response));
            });
        },
        listen(eventName, listener) {
            socket.on(eventName, listener);
        },
        unlisten(eventName) {
            socket.off(eventName);
        }
    };
};