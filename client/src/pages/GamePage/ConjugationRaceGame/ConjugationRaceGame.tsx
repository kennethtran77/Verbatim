import PageTitle from "../../../components/PageTitle/PageTitle";
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import VerbCard from "../../../components/VerbCard/VerbCard";
import LeaderboardCard from "../../../components/LeaderboardCard/LeaderboardCard";
import { Player } from "../../../../../server/src/models/player";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ConjugationRaceIO } from "../../../api/conjugation_race";
import StatsCard from "./StatsCard";
import { LeaderboardValue, Verb } from "../../../../../server/src/models/conjugation_race";
import LoadingPage from "../../LoadingPage/LoadingPage";
import { Duration, GameState } from "../../../../../server/src/models/game";
import GameEndPage from "../GameEndPage";
import Response from "../../../../../server/src/models/response";

import TimerIcon from '@mui/icons-material/Timer';

export type ConjugationRaceGameProps = {
    playerId: string;
    players: Player[];
    io: ConjugationRaceIO;
    gameState: GameState;
    gameCounter: number;
};

const ConjugationRaceGame = ({ playerId, players, io, gameState, gameCounter }: ConjugationRaceGameProps) => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardValue[]>(players.map((player: Player) => ({ playerName: player.username, score: 0 })));
    const [verbsSeen, setVerbsSeen] = useState(1);
    const [verbsCorrect, setVerbsCorrect] = useState(0);
    const [verbsIncorrect, setVerbsIncorrect] = useState(0);
    const [currentVerb, setCurrentVerb] = useState<Verb>();

    const [inputValue, setInputValue] = useState('');
    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value), []);

    const [timeLeft, setTimeLeft] = useState<Duration>({ minutes: 0, seconds: 0 });

    const [responseIndicator, setResponseIndicator] = useState<'correct' | 'incorrect' | ''>('');
    const [responseIndicatorTimeout, setResponseIndicatorTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [correctAnswer, setCorrectAnswer] = useState<string>('');

    // listen to game state changes
    useEffect(() => {
        io.onGameStart((firstVerb: Verb) => setCurrentVerb(firstVerb));
        io.onLeaderboardChange((newLeaderboard: LeaderboardValue[]) => setLeaderboard(newLeaderboard));
        io.onVerbsSeenChange((newVerbsSeen: number) => setVerbsSeen(newVerbsSeen));
        io.onVerbsCorrectChange((newVerbsCorrect: number) => setVerbsCorrect(newVerbsCorrect));
        io.onVerbsIncorrectChange((correctAnswer: string, newVerbsIncorrect: number) => {
            setCorrectAnswer(correctAnswer);
            setVerbsIncorrect(newVerbsIncorrect);
        });
    }, []);

    // handle response indicators
    useEffect(() => {
        handleResponseIndicator('incorrect');
        setCorrectAnswer(correctAnswer);
    }, [correctAnswer]);

    useEffect(() => {
        handleResponseIndicator('correct');
    }, [verbsCorrect]);

    // refresh timer
    useEffect(() => {
        const minutes = Math.floor(gameCounter / 60);
        const seconds = gameCounter - minutes * 60;

        setTimeLeft({ minutes, seconds });
    }, [gameCounter]);

    const handleResponseIndicator = (responseIndicator: '' | 'correct' | 'incorrect') => {
        if (responseIndicatorTimeout) {
            clearTimeout(responseIndicatorTimeout);
            setResponseIndicatorTimeout(null);
        }

        setResponseIndicatorTimeout(setTimeout(() => {
            setResponseIndicator('');
            setCorrectAnswer('');
        }, 2000));

        setResponseIndicator(responseIndicator);
    };

    if (!io || !currentVerb)
        return <LoadingPage />;

    const playerName = (players.find((player: Player) => player.id === playerId) as Player).username;

    if (gameState === 'ending') {
        return <GameEndPage
            leaderboard={leaderboard}
            playerName={playerName}
        />
    }

    const handleSubmit = (value: string) => {
        io.emitSubmitAnswer(value).then((submitRes: Response<Verb>) => {
            if (!submitRes.data) {
                return;
            }
    
            const nextVerb: Verb = submitRes.data;
            setCurrentVerb(nextVerb);
        });

        setInputValue('');
    };

    return (
        <>
            <PageTitle icon={<VideogameAssetIcon />} title="Conjugation Race" />
            <div className="center-flex align-items-center gap">
                <TimerIcon />
                {`${timeLeft.minutes}:${timeLeft.seconds < 10 ? '0' : ''}${timeLeft.seconds}`}
            </div>
            <div className="center-flex align-items-center gap">
                <VerbCard
                    verb={currentVerb}
                    value={inputValue}
                    handleChange={handleInputChange}
                    handleSubmit={() => handleSubmit(inputValue)}
                    handleSkip={() => handleSubmit('')}
                    correctAnswer={correctAnswer}
                />
                <div className="flex-column align-items-center gap">
                    <span>
                        <StatsCard
                            seen={verbsSeen}
                            correct={verbsCorrect}
                            incorrect={verbsIncorrect}
                            highlightCorrect={responseIndicator === 'correct'}
                            highlightIncorrect={responseIndicator === 'incorrect'}
                        />
                    </span>
                    <span>
                        <LeaderboardCard
                            leaderboard={leaderboard}
                            playerName={playerName}
                        />
                    </span>
                </div>
            </div>
        </>
    );
};

export default ConjugationRaceGame;