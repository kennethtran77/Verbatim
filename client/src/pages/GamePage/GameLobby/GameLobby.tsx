import PageTitle from "../../../components/PageTitle/PageTitle";
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import PersonIcon from '@mui/icons-material/Person';
import InfoIcon from '@mui/icons-material/Info';
import Button from "../../../components/Button/Button";

import styles from './GameLobby.module.css';
import { LobbyPlayer } from "../../../../../server/src/models/player";
import { GameLobbyIO } from "../../../api/game";
import { useEffect, useState } from "react";
import { GameSettings, GameState } from "../../../../../server/src/models/game";
import Modal from "../../../components/Modal/Modal";

type GameLobbyProps = {
    gameSettings: GameSettings;
    gameState: GameState;
    gameCode: string;
    playerId: string;
    players: LobbyPlayer[];
    setPlayerReady: (playerId: string) => void;
    timeToStart: number;
    io: GameLobbyIO;
};

type CircleProps = {
    player: LobbyPlayer;
    selfId: string;
}

const Circle = ({ player, selfId }: CircleProps) => {
    return (
        <div className="center-flex align-items-center gap">
            <div className={`${styles.circle} center-flex align-items-center`}>
                {player.ready ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </div>
            <span style={{ fontSize: '20px' }}>{player.username} {player.id === selfId && '(Me)'}</span>
        </div>
    );
};

const GameLobby = ({ gameSettings, gameState, gameCode, playerId, players, setPlayerReady, timeToStart, io }: GameLobbyProps) => {
    const [modalActive, setModalActive] = useState(false);

    // listen to game state changes
    useEffect(() => {
        if (io) {
            io.onPlayerReadyChange((playerId: string) => setPlayerReady(playerId));
        }
    }, [io, setPlayerReady]);

    const isSelfReady: boolean = players.find(p => p.id === playerId)?.ready as boolean;

    const numPlayersText: string = `${players.length === 1 ? '1 Player' : `${players.length} Players`} Connected`;

    return (
        <>
            <Modal active={modalActive} setActive={setModalActive}>
                <b>Gamemode:</b> {gameSettings.mode}
                <p><b>Duration:</b> {gameSettings.duration.minutes}m {gameSettings.duration.seconds}s</p>
                <p><b>Tenses:</b></p>
                <ul>
                    {gameSettings.tenses.map(tense => (
                        <li key={tense.value}>{tense.display}</li>
                    ))}
                </ul>
            </Modal>
            <PageTitle icon={<PlayForWorkIcon />} title="Game Lobby" />
            <main style={styles.main}>
                <h1 className="center-flex align-items-center">{<DirectionsCarIcon style={{ fontSize: '40px' }} />} {gameState === 'waiting' ? 'Waiting for players...' : `Starting in ${timeToStart}` }</h1>
                <div className="flex">
                    <span className="left-flex flex-1 align-items-center" aria-label={numPlayersText} title={numPlayersText}>{<PersonIcon />} <span style={{ fontSize: '24px' }}>{players.length}</span></span>
                    <h2>Game Code: {gameCode}</h2>
                    <span className="right-flex flex-1 align-items-center">
                        <Button icon={<InfoIcon />} text="" tooltip="Game Details" onClick={() => setModalActive(true)} />
                    </span>
                </div>
                <ul>
                    { players.map((player: LobbyPlayer) => (
                        <li key={player.id} className="left-flex">
                            <Circle player={player} selfId={playerId} />
                        </li>
                    ) )}
                </ul>
                <div className="space-between gap v-margin">
                    <Button text="Leave" icon={<ArrowBackIcon />} link="/" type='purple' />
                    <Button text="Ready" icon={isSelfReady ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />} type='yellow' disabled={isSelfReady} onClick={() => io.emitSetReady()} />
                </div>
            </main>
        </>
    );
};

export default GameLobby;