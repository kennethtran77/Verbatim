import IApi from './index';

import io from 'socket.io-client';
import { Duration, GameConnectionData, GameState } from '../../../server/src/models/game';
import Response from '../../../server/src/models/response';
import { Player } from '../../../server/src/models/player';
import { Verb } from '../../../server/src/models/conjugation_race';
import { LeaderboardValue } from './conjugation_race';

/** Establishes a connection to a Socket.io API */
const initApi = (baseURL: string): IApi => {
    const socket = io(`${baseURL}/game`);

    /**
     * Emits an event and returns a response from the server
     * @param eventName the name of the event to emit
     * @param data an object of arguments to pass to the server event listener
     * @returns a Response object
     */
    const emit = <T>(eventName: string, data?: Object) => new Promise<Response<T>>((resolve) => {
        // emits an event and expects a response in a callback
        socket.emit(eventName, data, (response: Response<T>) => resolve(response));
    })

    return {
        getPlayer: () => emit<Player>('game:getPlayer'),
        getGameStatus: (gameCode: string) => emit<string>('game:getStatus', { gameCode }),
        createGame: (mode: string, duration: Duration, tenses: string[]) => emit<string>('game:createGame', { mode, duration, tenses }),
        joinGame: async (gameCode: string) => {
            const res: Response<GameConnectionData> = await emit<GameConnectionData>('game:joinGame', { gameCode });

            if (!res.data) {
                return Promise.resolve({
                    success: res.success,
                    message: res.message
                });
            }

            return Promise.resolve({
                success: res.success,
                message: res.message,
                data: {
                    getInitialGameData: () => res.data,
                    getIO: () => ({
                        getGlobalIO: () => ({
                            onPlayerJoin: (handlePlayerJoin: ((player: Player) => void)) => socket.on('game:playerJoined', (player) => handlePlayerJoin(player)),
                            onPlayerQuit: (handlePlayerQuit: ((player: Player) => void)) => socket.on('game:playerQuit', (player) => handlePlayerQuit(player)),
                            onGameStateChange: (handleGameStateChange: ((newState: GameState) => void)) => socket.on('game:stateChange', (newState) => handleGameStateChange(newState)),
                            onCounterChange: (handleCounterChange: ((newCounterValue: number) => void)) => socket.on('game:counterChange', (newCounterValue) => handleCounterChange(newCounterValue)),
                            onGameDestroy: (handleGameDestroy: () => void) => socket.on('game:destroy', handleGameDestroy)
                        }),
                        getLobbyIO: () => ({
                            emitSetReady: () => socket.emit('game:setReady'),
                            onPlayerReadyChange: (handlePlayerReadyChange: ((playerId: string, newReadyState: boolean) => void)) => socket.on('game:playerReadyChange', ({ playerId, newReadyState }) => handlePlayerReadyChange(playerId, newReadyState)),
                        }),
                        getActiveIO: () => ({
                            getConjugationRaceIO: () => ({
                                onLeaderboardChange: (handleLeaderboardChange: ((orderedNames: LeaderboardValue[]) => void)) => socket.on('game:conjugationRace:leaderboardChange', (newOrderedNames) => handleLeaderboardChange(newOrderedNames)),
                                onVerbsSeenChange: (handleVerbsSeenChange: ((verbsSeen: number) => void)) => socket.on('game:conjugationRace:verbsSeenChange', (newVerbsSeen) => handleVerbsSeenChange(newVerbsSeen)),
                                onVerbsCorrectChange: (handleVerbsCorrectChange: ((verbsCorrect: number) => void)) => socket.on('game:conjugationRace:verbsCorrectChange', (newVerbsCorrect) => handleVerbsCorrectChange(newVerbsCorrect)),
                                onVerbsIncorrectChange: (handleVerbsIncorrectChange: ((correctAnswer: string, verbsIncorrect: number) => void)) => socket.on('game:conjugationRace:verbsIncorrectChange', ({ correctAnswer, newVerbsIncorrect }) => handleVerbsIncorrectChange(correctAnswer, newVerbsIncorrect)),
                                onGameStart: (handleGameStart: ((firstVerb: Verb) => void)) => socket.on('game:conjugationRace:gameStart', (firstVerb) => handleGameStart(firstVerb)),
                                emitSubmitAnswer: (answer: string) => emit<Verb>('game:conjugationRace:submitAnswer', answer)
                            })
                        })
                    })
                }
            });
        },
        leaveGame: () => socket.emit("game:leaveGame")
    };
}

export default initApi;