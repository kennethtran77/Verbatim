import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";
import GameLobby from "./GameLobby/GameLobby";
import { LobbyPlayer, Player } from "../../../../server/src/models/player";
import useGameContext from "../../hooks/useGameContext.hook";
import { GameState } from "../../../../server/src/models/game";
import ConjugationRaceGame from "./ConjugationRaceGame/ConjugationRaceGame";

const GamePage = () => {
    const { gameCode: gameCodeParam } = useParams();

    const [players, setPlayers] = useState<Player[]>([]);

    const [gameState, setGameState] = useState<GameState>('waiting');
    const [gameCounter, setGameCounter] = useState(10);
    const [gameContext, isGameLoading] = useGameContext(gameCodeParam || '');

    useEffect(() => {
        if (gameContext) {
            setPlayers(gameContext.getInitialGameData().initialPlayers);
        }
    }, [gameContext]);

    const setPlayerReady = useCallback((playerId: string) => setPlayers(prevPlayers => prevPlayers.map(p => p.id === playerId ? { ...p, ready: true } : p)), []);

    // listen to game state changes
    useEffect(() => {
        if (gameContext) {
            gameContext.getIO().getGlobalIO().onPlayerJoin((player: Player) => setPlayers(prevPlayers => prevPlayers.concat([player])));
            gameContext.getIO().getGlobalIO().onPlayerQuit((player: Player) => setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== player.id)));
            gameContext.getIO().getGlobalIO().onGameStateChange((newState: GameState) => setGameState(newState));
            gameContext.getIO().getGlobalIO().onCounterChange((newCounterValue: number) => setGameCounter(newCounterValue));
            gameContext.getIO().getGlobalIO().onGameDestroy(() => setGameState('ending'));
        }

        return () => {
            if (gameContext) {
                gameContext.getIO().getGlobalIO().unlisten();
            }
        }
    }, [gameContext]);

    const renderGamePage = () => {
        if (!gameCodeParam)
            return <Navigate to="/" />;
    
        if (!gameContext)
            return isGameLoading ? <LoadingPage /> : <Navigate to="/" />;

        const getGamePage = () => {
            switch (gameContext.getInitialGameData().settings.mode) {
                case 'conjugation-race':
                    return <ConjugationRaceGame
                        players={players}
                        playerId={gameContext.getInitialGameData().playerId}
                        io={gameContext.getIO().getActiveIO().getConjugationRaceIO()}
                        gameState={gameState}
                        gameCounter={gameCounter}
                    />;
                default:
                    return <></>;
            }
        }

        switch (gameState) {
            case 'waiting':
            case 'starting':
                return <GameLobby
                    gameSettings={gameContext.getInitialGameData().settings}
                    gameState={gameState}
                    gameCode={gameCodeParam}
                    players={players as LobbyPlayer[]}
                    playerId={gameContext.getInitialGameData().playerId}
                    setPlayerReady={setPlayerReady}
                    timeToStart={gameCounter}
                    io={gameContext.getIO().getLobbyIO()}
                />;
            case 'active':
            case 'ending':
                return getGamePage();
            default:
                return <Navigate to="/" />;
        }
    };

    return renderGamePage();
};

export default GamePage;