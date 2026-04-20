import { Namespace } from "socket.io";
import { EventEmitterService } from "../../ports/event_emitter";

export const createSocketIOEventEmitter = (io: Namespace): EventEmitterService => ({
    emit(eventName, gameCode, data) {
        io.in(gameCode).emit(eventName, data);
    },
});
