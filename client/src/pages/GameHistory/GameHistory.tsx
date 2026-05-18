import { useCallback, useState } from "react";
import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import LoadingPage from "../LoadingPage/LoadingPage";
import { LobbyPlayer, Player } from "@verbatim/shared/player";
import useGameContext from "../../hooks/useGameContext.hook";
import { GameState } from "@verbatim/shared/game";

const GameHistory = () => {
    const { gameCode: gameCodeParam } = useParams();

    if (!gameCodeParam)
        return <Navigate to="/" />;

};

export default GameHistory;