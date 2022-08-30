import { ConjugationRaceGame, LeaderboardValue, Verb } from "../../../models/conjugation_race";
import { Game } from "../../../models/game";
import { ConjugationRacePlayer, Player } from "../../../models/player";
import Response from "../../../models/response";
import { ConjugationRaceServices } from "../../../services/active/conjugation_race";
import { GameService } from "../../../services/global/game_service";
import Heap from 'heap-js';

export type SubmitAnswerEvent = (playerId: string, answer: string) => Response<Verb>;

const useSubmitAnswerEvent = (
    gameService: GameService,
    conjugationRaceServices: ConjugationRaceServices
): SubmitAnswerEvent => {
    // max heap
    const comparator = (player1: ConjugationRacePlayer, player2: ConjugationRacePlayer) => player2.verbsCorrect - player1.verbsCorrect;

    return (playerId, answer) => {
        const getPlayerRes: Response<Player> = gameService.getPlayer(playerId);

        if (!getPlayerRes.data) {
            return getPlayerRes as Response as Response<Verb>;
        }

        const player: Player = getPlayerRes.data;

        if (!(player instanceof ConjugationRacePlayer)) {
            return {
                success: false,
                message: "You are not in a Conjugation Race game."
            }
        }

        const getGameRes: Response<Game> = gameService.getGame(player.gameCode);

        if (!getGameRes.data) {
            return getPlayerRes as Response as Response<Verb>;
        }

        const game = getGameRes.data;

        if (!(game instanceof ConjugationRaceGame) || game.state !== 'active') {
            return {
                success: false,
                message: "This game is not active."
            };
        }

        const currentVerb: Verb = game.verbList[player.verbsSeen - 1];
        player.verbsSeen += 1;

        // strip verbs of accents
        const correctAnswer = conjugationRaceServices.verbService.conjugateVerb(currentVerb);
        const correctAnswerNoAccent = correctAnswer.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const userAnswer = answer.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        
        const correct = correctAnswerNoAccent === userAnswer;

        if (correct) {
            player.verbsCorrect += 1;
            gameService.emitToGame('game:conjugationRace:verbsCorrectChange', player.id, player.verbsCorrect);
        } else {
            player.verbsIncorrect += 1;
            gameService.emitToGame('game:conjugationRace:verbsIncorrectChange', player.id, { correctAnswer: correctAnswer, newVerbsIncorrect: player.verbsIncorrect });
        }

        // sort the leaderboard
        Heap.heapify(game.leaderboard, comparator);

        const newLeaderboard: LeaderboardValue[] = game.leaderboard.map(player => ({
            playerName: player.username,
            score: player.verbsCorrect
        }));

        gameService.emitToGame('game:conjugationRace:leaderboardChange', game.code, newLeaderboard);

        // fetch the next verb
        const nextVerb: Verb = game.verbList[player.verbsSeen - 1];

        return {
            success: correct,
            message: `${correct ? `Correctly` : `Incorrectly`} answered. Generating next verb.`,
            data: nextVerb
        }
    }
};

export default useSubmitAnswerEvent;