import { Player } from "../../../shared/player";
import { GameContext } from "./game";
import Response from "../../../shared/response";
import { Duration } from "../../../shared/game";

interface IApi {
    getPlayer(): Promise<Response<Player>>;
    getGameStatus(gameCode: string): Promise<Response<string>>;
    createGame(mode: string, duration: Duration, tenses: string[], maxPlayers: number): Promise<Response<string>>;
    joinGame(gameCode: string): Promise<Response<GameContext>>;
    leaveGame(): void;
}

export default IApi;