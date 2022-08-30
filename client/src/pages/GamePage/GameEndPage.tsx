import { LeaderboardValue } from "../../api/conjugation_race";
import Button from "../../components/Button/Button";
import LeaderboardCard from "../../components/LeaderboardCard/LeaderboardCard";
import ArrowBack from "@mui/icons-material/ArrowBack";

export interface GameEndPageProps {
    leaderboard: LeaderboardValue[];
    playerName: string;
}

const GameEndPage = ({ leaderboard, playerName }: GameEndPageProps) => {
    return (
        <div className="center-flex align-items-center" style={{ height: '100%'}}>
            <div>
                <h1 className="center-flex">Game Over</h1>
                <div className="center-flex align-items-center gap">
                    <div>
                        <LeaderboardCard
                            leaderboard={leaderboard}
                            playerName={playerName}
                        />
                        <Button
                            text="Home"
                            link="/"
                            type='yellow'
                            icon={<ArrowBack />}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: '10px'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameEndPage;