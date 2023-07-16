import { ConjugationRaceServices } from "../services/active/conjugation_race";
import { GameService } from "../services/global/game_service";
import { Game } from "./game";
import { ConjugationRacePlayer } from "./player";
import { Tense } from "./tenses";

export interface LeaderboardValue {
    playerName: string;
    score: number;
}

export class ConjugationRaceGame extends Game {
    /** A list of players sorted by verbs most correctly answered */
    leaderboard: ConjugationRacePlayer[];
    verbList: Verb[];

    /**
     * Updates the leaderboard.
     * @param gameService
     */
    updateLeaderboard(gameService: GameService) {
        const comparator = (player1: ConjugationRacePlayer, player2: ConjugationRacePlayer) => player2.verbsCorrect - player1.verbsCorrect;
        // sort the leaderboard
        this.leaderboard.sort(comparator);

        const newLeaderboard: LeaderboardValue[] = this.leaderboard.map(player => ({
            playerName: player.username,
            score: player.verbsCorrect
        }));

        gameService.emitToGame('game:conjugationRace:leaderboardChange', this.code, newLeaderboard);
    }

    /**
     * Increases the game's verb list.
     * @param conjugationRaceServices 
     */
    increaseVerbList(conjugationRaceServices: ConjugationRaceServices) {
        this.verbList = this.verbList.concat(conjugationRaceServices.verbService.generateUniqueVerbs(100, this.settings.tenses));
    }

    /**
     * Handles a player's input.
     * @param gameService 
     * @param conjugationRaceServices 
     * @param player 
     * @param currentVerb 
     * @param input 
     * @returns whether the player was correct
     */
    handlePlayerInput(
        gameService: GameService,
        conjugationRaceServices: ConjugationRaceServices,
        player: ConjugationRacePlayer,
        currentVerb: Verb,
        input: string
    ) {
        // Increment player's verbs seen count
        player.verbsSeen += 1;
        gameService.emitToGame('game:conjugationRace:verbsSeenChange', player.id, player.verbsSeen);

        // strip verbs of accents
        const correctAnswer = conjugationRaceServices.verbService.conjugateVerb(currentVerb);
        const correctAnswerNoAccent = correctAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const userAnswer = input.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        
        const correct = correctAnswerNoAccent === userAnswer;

        if (correct) {
            player.verbsCorrect += 1;
            gameService.emitToGame('game:conjugationRace:verbsCorrectChange', player.id, player.verbsCorrect);
        } else {
            player.verbsIncorrect += 1;
            gameService.emitToGame('game:conjugationRace:verbsIncorrectChange', player.id, { correctAnswer: correctAnswer, newVerbsIncorrect: player.verbsIncorrect });
        }

        // generate more verbs if the player has seen all generated verbs
        if (player.verbsSeen >= this.verbList.length) {
            this.increaseVerbList(conjugationRaceServices);
        }

        return correct;
    }
}

export interface Verb {
    infinitive: string;
    tense: Tense;
    subject: Subject;
    pronominal: boolean;
}

export type Subject = 'je' | 'tu' | 'il' | 'elle' | 'on' | 'nous' | 'vous' | 'ils' | 'elles';