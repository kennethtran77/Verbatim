import { Duration } from "../models/game";
import { GameEvents, GameServices } from "..";
import { EventBinder, EventListenerService } from "../../../ports/event_listener";

const createGameEventBinder = (
    services: GameServices,
    events: GameEvents
): EventBinder => (eventListener: EventListenerService) => {
    eventListener.listen("game:getPlayer", (playerId) => {
        return services.gameService.getPlayer(playerId);
    });

    eventListener.listen('game:getStatus', (playerId, { gameCode }: { gameCode: string }) => {
        return events.handleGetGameStatusEvent(gameCode);
    });

    eventListener.listen('game:createGame', (playerId, { mode, duration, tenses, maxPlayers }: { mode: string, duration: Duration, tenses: string[], maxPlayers: number }) => {
        return events.handleCreateGameEvent(mode, duration, tenses, maxPlayers);
    });

    eventListener.listen('game:joinGame', (playerId, { gameCode }: { gameCode: string }) => {
        return events.handleJoinGameEvent(playerId, gameCode);
    });

    eventListener.listen('game:setReady', (playerId) => {
        return events.handleSetReadyEvent(playerId);
    });

    eventListener.listen('disconnect', (playerId) => {
        return events.handleQuitGameEvent(playerId);
    });

    eventListener.listen('game:leaveGame', (playerId) => {
        return events.handleQuitGameEvent(playerId);
    });
};

export default createGameEventBinder;
