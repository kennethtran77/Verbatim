import { Duration } from "../models/game";
import { GlobalEvents, GlobalServices } from "../services";
import { EventListenerService } from "../services/global/event_listener";

/** Takes in an event handler service and returns an event handler service to allow controller composition */
export type Controller = (eventListener: EventListenerService) => EventListenerService;

/**
 * Given an event handler service, initializes a controller that listens and emits the global game functionality (join, quit, create game, etc.)
 */
const useGlobalController = (services: GlobalServices, events: GlobalEvents): Controller => (eventListener: EventListenerService) => {
    // Handle global events

    eventListener.listen("game:getPlayer", (playerId) => {
        return services.gameService.getPlayer(playerId);
    });

    eventListener.listen('game:getStatus', (playerId, { gameCode }: { gameCode: string }) => {
        return events.handleGetGameStatusEvent(gameCode);
    })

    eventListener.listen('game:createGame', (playerId, { mode, duration, tenses }: { mode: string, duration: Duration, tenses: string[] }) => {
        return events.handleCreateGameEvent(mode, duration, tenses);
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

    return eventListener;
};

export default useGlobalController;