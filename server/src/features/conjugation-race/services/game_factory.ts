import { ConjugationRaceGame } from "../models/conjugation_race";
import { GameSettings } from "../../game/models/game";
import { VerbService } from "./verb_service";
import { ConjugationRaceRepository } from "../ports/repository";
import { EventEmitterService } from "../../../ports/event_emitter";

export type ConjugationRaceGameFactory = (code: string, settings: GameSettings) => ConjugationRaceGame;

const createConjugationRaceGameFactory = (
    eventEmitter: EventEmitterService,
    verbService: VerbService,
    repository: ConjugationRaceRepository,
): ConjugationRaceGameFactory =>
    (code, settings) => new ConjugationRaceGame(eventEmitter, verbService, repository, code, settings);

export default createConjugationRaceGameFactory;
