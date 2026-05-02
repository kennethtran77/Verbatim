import { ConjugationRaceGame, Verb } from "../models/conjugation_race";
import { Game } from "../../game/models/game";
import { Player } from "../../game/models/player";
import { ConjugationRacePlayer } from "../models/player";
import Response from "../../../../../shared/response";
import { GameService } from "../../game/services/game_service";

export type SubmitAnswerEvent = (playerId: string, answer: string) => Response<Verb>;

const createSubmitAnswerEvent = (
    gameService: GameService,
): SubmitAnswerEvent => {
    return (playerId, answer) => {
        const getPlayerRes: Response<Player> = gameService.getPlayer(playerId);

        if (!getPlayerRes.data) {
            return getPlayerRes as Response as Response<Verb>;
        }

        const player: Player = getPlayerRes.data;

        if (!(player instanceof ConjugationRacePlayer)) {
            return {
                success: false,
                message: "You are not in a Conjugation Race game.",
            };
        }

        const getGameRes: Response<Game> = gameService.getGame(player.gameCode);

        if (!getGameRes.data) {
            return getPlayerRes as Response as Response<Verb>;
        }

        const game = getGameRes.data;

        if (!(game instanceof ConjugationRaceGame) || game.state !== 'active') {
            return {
                success: false,
                message: "This game is not active.",
            };
        }

        const currentVerb: Verb = game.verbList[player.verbsSeen - 1];

        // handle player input
        const correct: boolean = game.handlePlayerInput(player, currentVerb, answer);

        // sort the leaderboard
        game.updateLeaderboard();

        // fetch the next verb
        const nextVerb: Verb = game.verbList[player.verbsSeen - 1];

        return {
            success: correct,
            message: `${correct ? `Correctly` : `Incorrectly`} answered. Generating next verb.`,
            data: nextVerb,
        };
    };
};

export default createSubmitAnswerEvent;
