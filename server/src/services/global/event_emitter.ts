import { Namespace } from "socket.io";

/** Emits an event with data to all players in a game */
export interface EventEmitterService {
    emit: (eventName: string, gameCode: string, data: any) => void;
}

export const useSocketIOEventEmitter = (io: Namespace): EventEmitterService => {
    return {
        emit(eventName, gameCode, data) {
            io.in(gameCode).emit(eventName, data);
        }
    };
};