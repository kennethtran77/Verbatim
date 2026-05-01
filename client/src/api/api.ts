import IApi from './index';

import { Duration } from '../../../shared/game';
import { EventHandler } from './event_handler';

const initApi = (eventHandler: EventHandler): IApi => {
    return {
        getPlayer: () => eventHandler.emit('game:getPlayer'),
        getGameStatus: (gameCode: string) => eventHandler.emit('game:getStatus', { gameCode }),
        createGame: (mode: string, duration: Duration, tenses: string[], maxPlayers: number) => eventHandler.emit('game:createGame', { mode, duration, tenses, maxPlayers }),
        leaveGame: () => eventHandler.emit('game:leaveGame'),
        joinGame: async (gameCode: string) => {
            const res = await eventHandler.emit('game:joinGame', { gameCode });

            if (!res.data) {
                return {
                    success: res.success,
                    message: res.message
                };
            }

            return {
                success: res.success,
                message: res.message,
                data: {
                    getInitialGameData: () => res.data!,
                    getIO: () => ({
                        getGlobalIO: () => ({
                            onPlayerJoin: (handlePlayerJoin) => eventHandler.listen('game:playerJoined', handlePlayerJoin),
                            onPlayerQuit: (handlePlayerQuit) => eventHandler.listen('game:playerQuit', handlePlayerQuit),
                            onGameStateChange: (handleGameStateChange) => eventHandler.listen('game:stateChange', handleGameStateChange),
                            onCounterChange: (handleCounterChange) => eventHandler.listen('game:counterChange', handleCounterChange),
                            onGameDestroy: (handleGameDestroy) => eventHandler.listen('game:destroy', handleGameDestroy),
                            unlisten: () => {
                                eventHandler.unlisten('game:playerJoined');
                                eventHandler.unlisten('game:playerQuit');
                                eventHandler.unlisten('game:stateChange');
                                eventHandler.unlisten('game:counterChange');
                                eventHandler.unlisten('game:destroy');
                            }
                        }),
                        getLobbyIO: () => ({
                            emitSetReady: () => { eventHandler.emit('game:setReady'); },
                            onPlayerReadyChange: (handlePlayerReadyChange) => eventHandler.listen('game:playerReadyChange', ({ playerId, newReadyState }) => handlePlayerReadyChange(playerId, newReadyState)),
                            unlisten: () => {
                                eventHandler.unlisten('game:playerReadyChange');
                            }
                        }),
                        getActiveIO: () => ({
                            getConjugationRaceIO: () => ({
                                onLeaderboardChange: (handleLeaderboardChange) => eventHandler.listen('game:conjugationRace:leaderboardChange', handleLeaderboardChange),
                                onVerbsSeenChange: (handleVerbsSeenChange) => eventHandler.listen('game:conjugationRace:verbsSeenChange', handleVerbsSeenChange),
                                onVerbsCorrectChange: (handleVerbsCorrectChange) => eventHandler.listen('game:conjugationRace:verbsCorrectChange', handleVerbsCorrectChange),
                                onVerbsIncorrectChange: (handleVerbsIncorrectChange) => eventHandler.listen('game:conjugationRace:verbsIncorrectChange', ({ correctAnswer, newVerbsIncorrect }) => handleVerbsIncorrectChange(correctAnswer, newVerbsIncorrect)),
                                onGameStart: (handleGameStart) => eventHandler.listen('game:conjugationRace:gameStart', handleGameStart),
                                emitSubmitAnswer: (answer: string) => eventHandler.emit('game:conjugationRace:submitAnswer', answer),
                                unlisten: () => {
                                    eventHandler.unlisten('game:conjugationRace:leaderboardChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsSeenChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsCorrectChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsIncorrectChange');
                                    eventHandler.unlisten('game:conjugationRace:gameStart');
                                }
                            })
                        })
                    })
                }
            };
        }
    };
}

export default initApi;
