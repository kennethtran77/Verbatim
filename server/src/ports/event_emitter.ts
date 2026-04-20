/** Emits an event with data to all players in a game */
export interface EventEmitterService {
    emit: (eventName: string, gameCode: string, data: any) => void;
}
