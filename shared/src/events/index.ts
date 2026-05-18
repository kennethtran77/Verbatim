import { GameClientToServerEvents, GameServerToClientEvents } from "./game";
import { ConjugationRaceClientToServerEvents, ConjugationRaceServerToClientEvents } from "./conjugation_race";
import Response from "../response";

export interface ClientToServerEvents extends
    GameClientToServerEvents,
    ConjugationRaceClientToServerEvents {}

export interface ServerToClientEvents extends
    GameServerToClientEvents,
    ConjugationRaceServerToClientEvents {}

export type Ack<R> = (res: R) => void;

/** A client to server request with no payload; the server replies via ack with R */
export type ClientRequestNoPayload<R> = (ack: Ack<R>) => void;

/** A client to server request with payload P; the server replies via ack with R */
export type ClientRequest<P, R> = (payload: P, ack: Ack<R>) => void;

/** The payload type for a client→server event; undefined for no-payload events */
export type ClientPayload<E> =
    E extends ClientRequestNoPayload<Response<any>> ? undefined :
    E extends ClientRequest<infer P, Response<any>> ? P :
    never;

/** Args to pass to `emit` for a given event */
export type EmitParams<E> =
    // Empty tuple if type is client request with no payload
    E extends ClientRequestNoPayload<Response<any>> ? [] :
    // Single element tuple with payload if type is client request with payload
    E extends ClientRequest<infer P, Response<any>> ? [payload: P] :
    E extends () => void ? [] :
    never;

/** Type the emit promise resolves to (the server's Response, or void) */
export type EmitResponse<E> =
    // Extract response type if type is client request
    E extends ClientRequestNoPayload<infer R> ? R :
    E extends ClientRequest<any, infer R> ? R :
    E extends () => void ? void :
    never;
