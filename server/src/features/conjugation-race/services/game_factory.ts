import { ConjugationRaceGame, Verb } from "../models/conjugation_race";
import { Game } from "../../game/models/game";
import { Player } from "../../game/models/player";
import { ConjugationRacePlayer } from "../models/player";
import { GameService } from "../../game/services/game_service";
import { VerbService } from "./verb_service";
import Response from "../../../shared/response";
import { ConjugationRaceDbService } from "./db";

export type ConjugationRaceGameFactory = (game: Game) => ConjugationRaceGame;

const useConjugationRaceGameFactory = (
    dbService: ConjugationRaceDbService,
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
                game.onStart.call(this, gameService);
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
                game.onEnd.call(this, gameService);
                dbService.saveGameData(this);
            }
        }, ConjugationRaceGame.prototype);
    }
}

export default useConjugationRaceGameFactory;