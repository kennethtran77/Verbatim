import { Duration } from "../models/game";
import { GlobalEvents, GlobalServices } from "../services";
import { EventListenerService } from "../services/global/event_listener";

/** A function that initializes event handlers on a given event listener */
export type EventController = (eventListener: EventListenerService) => void;

/**
 * Given an event handler service, initializes a controller that listens and emits the global game functionality (join, quit, create game, etc.)
 */
const useGlobalController = (
    services: GlobalServices,
    events: GlobalEvents
): EventController => (eventListener: EventListenerService) => {
    // Handle global events

    eventListener.listen("game:getPlayer", (playerId) => {
        return services.gameService.getPlayer(playerId);
    });

    eventListener.listen('game:getStatus', (playerId, { gameCode }: { gameCode: string }) => {
        return events.handleGetGameStatusEvent(gameCode);
    })

    eventListener.listen('game:createGame', (playerId, { mode, duration, tenses, maxPlayers }: { mode: string, duration: Duration, tenses: string[], maxPlayers: number }) => {
        return events.handleCreateGameEvent(mode, duration, tenses, maxPlayers);
    });

    eventListener.listen('game:joinGame', (playerId, { gameCode }: {gameCode: string }) => {
        return events.handleJoinGameEvent(playerId, gameCode);
    });

    eventListener.listen('game:setReady', (playerId) => {
        return events.handleSetReadyEvent(playerId);
    });

    eventListener.listen('disconnect', (playerId) => {
        return events.handleQuitGameEvent(playerId);
    })

    eventListener.listen('game:leaveGame', (playerId) => {
        return events.handleQuitGameEvent(playerId);
    });
};

export default useGlobalController;