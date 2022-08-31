import IApi from './index';

import { Duration, GameConnectionData, GameState } from '../../../server/src/models/game';
import Response from '../../../server/src/models/response';
import { Player } from '../../../server/src/models/player';
import { LeaderboardValue, Verb } from '../../../server/src/models/conjugation_race';
import { EventHandler } from './event_handler';

const initApi = (eventHandler: EventHandler): IApi => {
    return {
        getPlayer: () => eventHandler.emit<Player>('game:getPlayer'),
        getGameStatus: (gameCode: string) => eventHandler.emit<string>('game:getStatus', { gameCode }),
        createGame: (mode: string, duration: Duration, tenses: string[], maxPlayers: number) => eventHandler.emit<string>('game:createGame', { mode, duration, tenses, maxPlayers }),
        leaveGame: () => eventHandler.emit("game:leaveGame"),
        joinGame: async (gameCode: string) => {
            const res: Response<GameConnectionData> = await eventHandler.emit<GameConnectionData>('game:joinGame', { gameCode });

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
                            onPlayerJoin: (handlePlayerJoin: ((player: Player) => void)) => eventHandler.listen('game:playerJoined', (player) => handlePlayerJoin(player)),
                            onPlayerQuit: (handlePlayerQuit: ((player: Player) => void)) => eventHandler.listen('game:playerQuit', (player) => handlePlayerQuit(player)),
                            onGameStateChange: (handleGameStateChange: ((newState: GameState) => void)) => eventHandler.listen('game:stateChange', (newState) => handleGameStateChange(newState)),
                            onCounterChange: (handleCounterChange: ((newCounterValue: number) => void)) => eventHandler.listen('game:counterChange', (newCounterValue) => handleCounterChange(newCounterValue)),
                            onGameDestroy: (handleGameDestroy: () => void) => eventHandler.listen('game:destroy', handleGameDestroy),
                            unlisten: () => {
                                eventHandler.unlisten('game:playerJoined');
                                eventHandler.unlisten('game:playerQuit');
                                eventHandler.unlisten('game:stateChange');
                                eventHandler.unlisten('game:counterChange');
                                eventHandler.unlisten('game:destroy');
                            }
                        }),
                        getLobbyIO: () => ({
                            emitSetReady: () => eventHandler.emit('game:setReady'),
                            onPlayerReadyChange: (handlePlayerReadyChange: ((playerId: string, newReadyState: boolean) => void)) => eventHandler.listen('game:playerReadyChange', ({ playerId, newReadyState }) => handlePlayerReadyChange(playerId, newReadyState)),
                            unlisten: () => {
                                eventHandler.unlisten('game:setReady');
                                eventHandler.unlisten('game:playerReadyChange');
                            }
                        }),
                        getActiveIO: () => ({
                            getConjugationRaceIO: () => ({
                                onLeaderboardChange: (handleLeaderboardChange: ((orderedNames: LeaderboardValue[]) => void)) => eventHandler.listen('game:conjugationRace:leaderboardChange', (newOrderedNames) => handleLeaderboardChange(newOrderedNames)),
                                onVerbsSeenChange: (handleVerbsSeenChange: ((verbsSeen: number) => void)) => eventHandler.listen('game:conjugationRace:verbsSeenChange', (newVerbsSeen) => handleVerbsSeenChange(newVerbsSeen)),
                                onVerbsCorrectChange: (handleVerbsCorrectChange: ((verbsCorrect: number) => void)) => eventHandler.listen('game:conjugationRace:verbsCorrectChange', (newVerbsCorrect) => handleVerbsCorrectChange(newVerbsCorrect)),
                                onVerbsIncorrectChange: (handleVerbsIncorrectChange: ((correctAnswer: string, verbsIncorrect: number) => void)) => eventHandler.listen('game:conjugationRace:verbsIncorrectChange', ({ correctAnswer, newVerbsIncorrect }) => handleVerbsIncorrectChange(correctAnswer, newVerbsIncorrect)),
                                onGameStart: (handleGameStart: ((firstVerb: Verb) => void)) => eventHandler.listen('game:conjugationRace:gameStart', (firstVerb) => handleGameStart(firstVerb)),
                                emitSubmitAnswer: (answer: string) => eventHandler.emit<Verb>('game:conjugationRace:submitAnswer', answer),
                                unlisten: () => {
                                    eventHandler.unlisten('game:conjugationRace:leaderboardChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsSeenChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsCorrectChange');
                                    eventHandler.unlisten('game:conjugationRace:verbsIncorrectChange');
                                    eventHandler.unlisten('game:conjugationRace:gameStart');
                                    eventHandler.unlisten('game:conjugationRace:submitAnswer');
                                }
                            })
                        })
                    })
                }
            });
        }
    };
}

export default initApi;