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
                { playerRank <= 4 ?
                    leaderboard.map((player: LeaderboardValue, index: number) => (
                        <li key={player.playerName} style={player.playerName === playerName ? { fontWeight: 'bold'} : {}} className="">
                            <span className="flex space-between">
                                <div>{player.playerName}</div>
                                <div>{player.score}</div>
                            </span>
                        </li>
                    ))    
                :
                    <>
                        {leaderboard.slice(0, 3).map((player: LeaderboardValue) => <li key={player.playerName}>
                            <span className="flex space-between">
                                {player.playerName}
                                {player.score}
                            </span>
                        </li>)}
                        <span>...</span> 
                        <li key={playerName} value={playerRank} style={{ fontWeight: 'bold' }}>
                            <span className="flex space-between">
                                {playerName}
                                {playerScore}
                            </span>
                        </li>
                    </>
                }
            </ol>
        </Card>
    );
};

export default LeaderboardCard;