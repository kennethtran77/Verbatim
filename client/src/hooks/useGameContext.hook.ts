import { useState, useEffect } from "react";
import { useServices } from "../contexts/services";
import { GameContext } from "../api/game";
import Response from "../../../server/src/models/response";

const useGameContext = (gameCode: string): [GameContext | null, boolean] => {
    const { getApi } = useServices();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gameContext, setGameContext] = useState<GameContext | null>(null);

    // get the game context from the server
    useEffect(() => {
        if (gameCode) {
            const getGameContext = async () => {
                const res: Response<GameContext> = await getApi().joinGame(gameCode);

                if (res.data) {
                    const gameContext: GameContext = res.data;
                    setGameContext(gameContext);
                }

                setIsLoading(false);
            };
    
            getGameContext();
        }
    }, [gameCode, getApi]);

    return [gameContext, isLoading];
}

export default useGameContext;