import { Duration, GameConnectionData, GameState } from "../game";
import { Player } from "../player";
import Response from "../response";
import type { ClientRequest, ClientRequestNoPayload } from ".";

export interface GameClientToServerEvents {
    'game:getPlayer': ClientRequestNoPayload<Response<Player>>;
    'game:getStatus': ClientRequest<{ gameCode: string }, Response<GameState>>;
    'game:createGame': ClientRequest<
        { mode: string; duration: Duration; tenses: string[]; maxPlayers: number },
        Response<string>
    >;
    'game:joinGame': ClientRequest<{ gameCode: string }, Response<GameConnectionData>>;
    'game:leaveGame': ClientRequestNoPayload<Response>;
    'game:setReady': ClientRequestNoPayload<Response>;
}

export interface GameServerToClientEvents {
    'game:playerJoined': (player: Player) => void;
    'game:playerQuit': (player: Player) => void;
    'game:stateChange': (newState: GameState) => void;
    'game:counterChange': (newCounterValue: number) => void;
    'game:destroy': () => void;
    'game:playerReadyChange': (payload: { playerId: string; newReadyState: boolean }) => void;
}
