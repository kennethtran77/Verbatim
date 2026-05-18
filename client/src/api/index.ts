import { Player } from "@verbatim/shared/player";
import { GameContext } from "./game";
import Response from "@verbatim/shared/response";
import { Duration, GameState } from "@verbatim/shared/game";

interface IApi {
    getPlayer(): Promise<Response<Player>>;
    getGameStatus(gameCode: string): Promise<Response<GameState>>;
    createGame(mode: string, duration: Duration, tenses: string[], maxPlayers: number): Promise<Response<string>>;
    joinGame(gameCode: string): Promise<Response<GameContext>>;
    leaveGame(): void;
}

export default IApi;