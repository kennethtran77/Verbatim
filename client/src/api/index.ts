import { Player } from "../../../server/src/models/player";
import { GameContext } from "./game";
import Response from "../../../server/src/models/response";

interface IApi {
    getPlayer(): Promise<Response<Player>>;
    getGameStatus(gameCode: string): Promise<Response<string>>;
    createGame(mode: string, duration: { minutes: number, seconds: number }, tenses: string[], maxPlayers: number): Promise<Response<string>>;
    joinGame(gameCode: string): Promise<Response<GameContext>>;
    leaveGame(): void;
}

export default IApi;