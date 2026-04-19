import { ConjugationRaceGame, Verb } from "../../../models/conjugation_race";
import { Game } from "../../../models/game";
import { ConjugationRacePlayer, Player } from "../../../models/player";
import { GameService } from "../../global/game_service";
import { VerbService } from "./verb_service";
import Response from "../../../models/response";

export type ConjugationRaceGameFactory = (game: Game) => ConjugationRaceGame;

const useConjugationRaceGameFactory = (
    verbService: VerbService
): ConjugationRaceGameFactory => {
    return (game) => {
        const leaderboard: ConjugationRacePlayer[] = [];
        // TODO change amount to be dynamic
        const verbList: Verb[] = verbService.generateUniqueVerbs(100, game.settings.tenses);
    
        return Object.setPrototypeOf({
            ...game,
            leaderboard,
            verbList,
            onStart(gameService: GameService) {
                game.onStart(gameService);
                gameService.emitToGame('game:conjugationRace:gameStart', game.code, verbList[0]);

                // convert each player to a ConjugationRacePlayer and add them to leaderboard
                this.players.forEach((player: Player) => {
                    const convertedPlayerRes: Response<Player> = gameService.convertPlayer(player, 'conjugation-race');

                    if (!convertedPlayerRes.data) {
                        return;
                    }

                    leaderboard.push(convertedPlayerRes.data as ConjugationRacePlayer);
                });
            },
            onEnd(gameService: GameService) {
                game.onEnd(gameService);
            }
        }, ConjugationRaceGame.prototype);
    }
}

export default useConjugationRaceGameFactory;