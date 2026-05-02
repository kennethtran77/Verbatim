import { Game } from "../../game/models/game";
import { GameSettings } from "../../../../../shared/game";
import { Player } from "../../game/models/player";
import { ConjugationRacePlayer } from "./player";
import { LeaderboardValue, Verb, VerbResponse } from "../../../../../shared/conjugation_race";
import { EventEmitterService } from "../../../ports/event_emitter";
import { VerbService } from "../services/verb_service";
import { ConjugationRaceRepository } from "../ports/repository";

export { LeaderboardValue, Verb, VerbResponse, Subject } from "../../../../../shared/conjugation_race";

export class ConjugationRaceGame extends Game {
    /** A list of players sorted by verbs most correctly answered. */
    leaderboard: ConjugationRacePlayer[] = [];
    verbList: Verb[];

    constructor(
        eventEmitter: EventEmitterService,
        private verbService: VerbService,
        private repository: ConjugationRaceRepository,
        code: string,
        settings: GameSettings,
    ) {
        super(eventEmitter, code, settings);
        this.verbList = verbService.generateUniqueVerbs(100, settings.tenses);
    }

    onStart(convertedPlayers: Player[]) {
        super.onStart(convertedPlayers);
        this.leaderboard = convertedPlayers as ConjugationRacePlayer[];
        this.eventEmitter.emit('game:conjugationRace:gameStart', this.code, this.verbList[0]);
    }

    onEnd() {
        super.onEnd();
        this.repository.saveGameData(this);
    }

    /** Append additional verbs to the game's verb list. */
    appendVerbs(verbs: Verb[]) {
        this.verbList = this.verbList.concat(verbs);
    }

    /** Sort the leaderboard and emit the new ordering to all players. */
    updateLeaderboard() {
        const comparator = (a: ConjugationRacePlayer, b: ConjugationRacePlayer) => b.verbsCorrect - a.verbsCorrect;
        this.leaderboard.sort(comparator);

        const newLeaderboard: LeaderboardValue[] = this.leaderboard.map(player => ({
            playerName: player.username,
            score: player.verbsCorrect,
        }));

        this.eventEmitter.emit('game:conjugationRace:leaderboardChange', this.code, newLeaderboard);
    }

    /** Generate more verbs and append them to the verb list. */
    increaseVerbList() {
        this.appendVerbs(this.verbService.generateUniqueVerbs(100, this.settings.tenses));
    }

    /** Process a player's input. Returns whether the answer was correct. */
    handlePlayerInput(player: ConjugationRacePlayer, currentVerb: Verb, input: string): boolean {
        player.verbsSeen += 1;
        this.eventEmitter.emit('game:conjugationRace:verbsSeenChange', player.id, player.verbsSeen);

        const correctAnswer = this.verbService.conjugateVerb(currentVerb);
        const correctAnswerNoAccent = correctAnswer.normalize('NFD').replace(/[̀-ͯ]/g, "");
        const userAnswer = input.normalize('NFD').replace(/[̀-ͯ]/g, "");

        const correct = correctAnswerNoAccent === userAnswer;

        const verbResponse: VerbResponse = {
            verb: currentVerb.infinitive,
            input,
            correctAnswer,
            isInputCorrect: correct,
            answerTime: new Date(),
        };
        player.verbResponses.push(verbResponse);

        if (correct) {
            player.verbsCorrect += 1;
            this.eventEmitter.emit('game:conjugationRace:verbsCorrectChange', player.id, player.verbsCorrect);
        } else {
            player.verbsIncorrect += 1;
            this.eventEmitter.emit('game:conjugationRace:verbsIncorrectChange', player.id, { correctAnswer, newVerbsIncorrect: player.verbsIncorrect });
        }

        if (player.verbsSeen >= this.verbList.length) {
            this.increaseVerbList();
        }

        return correct;
    }
}
