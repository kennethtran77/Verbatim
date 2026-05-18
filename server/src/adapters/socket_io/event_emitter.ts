import { Namespace } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "@verbatim/shared/events";
import { EventEmitterService } from "../../ports/event_emitter";

export const createSocketIOEventEmitter = (
    io: Namespace<ClientToServerEvents, ServerToClientEvents>
): EventEmitterService => ({
    emit(eventName, gameCode, ...args) {
        io.in(gameCode).emit(eventName, ...args);
    },
});
