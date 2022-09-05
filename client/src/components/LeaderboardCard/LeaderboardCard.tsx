import Card from "../Card/Card";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import { LeaderboardValue } from "../../../../server/src/models/conjugation_race";

export type LeaderboardCardProps = {
    leaderboard: LeaderboardValue[];
    playerName: string;
};

const LeaderboardCard = ({ leaderboard, playerName }: LeaderboardCardProps) => {
    const playerRank: number = leaderboard.findIndex((player: LeaderboardValue) => playerName === player.playerName) + 1;
    const playerScore: number = leaderboard[playerRank - 1].score;

    return (
        <Card
            icon={<LeaderboardIcon />}
            header={<h3 style={{ margin: 0 }}>Leaderboard</h3>}
            cardStyle={{
                width: '250px',
                minHeight: '300px'
            }}
        >
            <ol style={{
                listStylePosition: 'outside',
                margin: 0,
                paddingLeft: 20,
                gap: 5
            }}
            >
                { playerRank <= 3 ?
                // If the player is within top 3, display them and the last player
                    <>
                        {leaderboard.slice(0, 3).map((player: LeaderboardValue, index: number) => (
                            <li key={player.playerName} style={player.playerName === playerName ? { fontWeight: 'bold'} : {}} className="">
                                <span className="flex space-between">
                                    <div>{player.playerName}</div>
                                    <div>{player.score}</div>
                                </span>
                            </li>
                        ))}
                        <span>...</span>
                        <li key={leaderboard[leaderboard.length - 1].playerName} value={leaderboard.length}>
                            <span className="flex space-between">
                                <div>{leaderboard[leaderboard.length - 1].playerName}</div>
                                <div>{leaderboard[leaderboard.length - 1].score}</div>
                            </span>
                        </li>
                    </>
                :
                // If the player is rank 4 or lower, display them in between the top 3 and the last player
                    <>
                        {leaderboard.slice(0, 3).map((player: LeaderboardValue) => <li key={player.playerName}>
                            <span className="flex space-between">
                                <div>{player.playerName}</div>
                                <div>{player.score}</div>
                            </span>
                        </li>)}
                        <span>...</span> 
                        <li key={playerName} value={playerRank} style={{ fontWeight: 'bold' }}>
                            <span className="flex space-between">
                                <div>{playerName}</div>
                                <div>{playerScore}</div>
                            </span>
                        </li>
                        {playerRank !== leaderboard.length &&
                            // display the last player if this player is not in last place
                            <>
                            <span>...</span>
                            <li key={leaderboard[leaderboard.length - 1].playerName} value={leaderboard.length}>
                                <span className="flex space-between">
                                    <div>{leaderboard[leaderboard.length - 1].playerName}</div>
                                    <div>{leaderboard[leaderboard.length - 1].score}</div>
                                </span>
                            </li>
                            </>
                        }
                    </>
                }
            </ol>
        </Card>
    );
};

export default LeaderboardCard;