import Button from "../../components/Button/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import styles from './CreateGame.module.css';
import PageTitle from "../../components/PageTitle/PageTitle";

import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import Dropdown, { DropdownElement } from "../../components/Dropdown/Dropdown";
import { ChangeEvent, useState } from "react";
import Input from "../../components/Input/Input";
import { useCallback } from "react";
import Toggle from "../../components/Toggle/Toggle";
import Response from "../../../../server/src/models/response";
import { useServices } from "../../contexts/services";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { Duration } from "../../../../server/src/models/game";
import { tenseNames, TenseValue } from "../../models/tenses";

const gameItems: DropdownElement[] = [
    {
        value: "conjugation-race",
        display: "Conjugation Race"
    }
];

type Tenses = {
    [key in TenseValue]: boolean;
};

const CreateGame = () => {
    const { getApi } = useServices();

    const navigate = useNavigate();

    const [modalMessage, setModalMessage] = useState('');

    const [maxPlayers, setMaxPlayers] = useState(30);
    const [gamemode, setGamemode] = useState(gameItems[0]);
    const [gametime, setGametime] = useState<Duration>({ minutes: 1, seconds: 30 });
    const [tenses, setTenses] = useState<Tenses>(tenseNames.reduce((prev: Tenses, curr: TenseValue) => ({ ...prev, [curr]: false, 'PRESENT': true }), {} as Tenses));

    const handleGameTimeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setGametime(prev => ({ ...prev, [e.target.title]: Number(e.target.value) })), []);

    const handleMaxPlayersChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setMaxPlayers(Number(e.target.title)), []);

    const handleToggleTense = useCallback((e: ChangeEvent<HTMLInputElement>) => setTenses((prev: Tenses) => {
        const currentTense = e.target.title as TenseValue;

        // do not do anything if the current tense is the only one selected
        if (prev[currentTense] && Object.keys(prev).every((tense) => tense === currentTense || !prev[tense as TenseValue])) {
            return prev;
        }

        return { ...prev, [currentTense]: !prev[currentTense] };
    }), []);

    const handleCreateGame = useCallback(async () => {
        const res: Response<string> = await getApi().createGame(gamemode.value, gametime, Object.keys(tenses).filter(tense => tenses[tense as TenseValue]));

        if (!res.success) {
            setModalMessage(res.message);
        } else {
            const gameCode = res.data;
            navigate(`/game/${gameCode}`);
        }
    }, [gamemode, gametime, tenses, getApi, navigate]);

    const labelStyle = { marginTop: '10px', fontWeight: 'bold' };

    return (
        <>
            <Modal active={Boolean(modalMessage.length)} setActive={(state: boolean) => state ? {} : setModalMessage('')}>{modalMessage}</Modal>
            <PageTitle icon={<DisplaySettingsIcon />} title="Game Settings" />
            <form style={styles} className="flex-column">
                <Input
                    label="Max Players"
                    title="max-players"
                    type="number"
                    min="2"
                    max="30"
                    breakLine={true}
                    value={maxPlayers}
                    labelStyle={labelStyle}
                    onChange={handleMaxPlayersChange}
                />
                <Dropdown
                    label="Gamemode"
                    breakLine={true}
                    items={gameItems}
                    currItem={gamemode}
                    labelStyle={labelStyle}
                    onChange={(mode) => setGamemode(mode)}
                />
                <label style={labelStyle}>Game Time</label>
                <div className="flex gap align-items-center">
                    <Input
                        label="Minutes"
                        title="minutes"
                        type="number"
                        min="0"
                        max="4"
                        value={gametime.minutes}
                        breakLine={false}
                        onChange={handleGameTimeChange}
                    />
                    <Input
                        label="Seconds"
                        title="seconds"
                        type="number"
                        min="0"
                        max="59"
                        breakLine={false}
                        value={gametime.seconds}
                        onChange={handleGameTimeChange}
                    />
                </div>
                <label style={labelStyle}>Tenses</label>
                <div className="space-between gap">
                    <div className="flex-column gap">
                        <label>Indicatif</label>
                        <Toggle
                            label="Présent"
                            title="PRESENT"
                            checked={tenses['PRESENT']}
                            onChange={handleToggleTense}
                        />
                        <Toggle
                            label="Passé Composé"
                            title="PASSE_COMPOSE"
                            checked={tenses['PASSE_COMPOSE']}
                            onChange={handleToggleTense}
                        />
                        <Toggle
                            label="Imparfait"
                            title="IMPARFAIT"
                            checked={tenses['IMPARFAIT']}
                            onChange={handleToggleTense}
                        />
                        <Toggle
                            label="Passé Simple"
                            title="PASSE_SIMPLE"
                            checked={tenses['PASSE_SIMPLE']}
                            onChange={handleToggleTense}
                        />
                        <Toggle
                            label="Plus-Que-Parfait"
                            title="PLUS_QUE_PARFAIT"
                            checked={tenses['PLUS_QUE_PARFAIT']}
                            onChange={handleToggleTense}
                        />
                    </div>
                    <div className="flex-column gap">
                        <label>Conditionnel</label>
                        <Toggle
                            label="Présent"
                            title="CONDITIONNEL_PRESENT"
                            checked={tenses['CONDITIONNEL_PRESENT']}
                            onChange={handleToggleTense}
                        />
                    </div>
                    <div className="flex-column gap">
                        <label>Subjonctif</label>
                        <Toggle
                            label="Présent"
                            title="SUBJONCTIF_PRESENT"
                            checked={tenses['SUBJONCTIF_PRESENT']}
                            onChange={handleToggleTense}
                        />
                        <Toggle
                            label="Imparfait"
                            title="SUBJONCTIF_IMPARFAIT"
                            checked={tenses['SUBJONCTIF_IMPARFAIT']}
                            onChange={handleToggleTense}
                        />
                    </div>
                    <div className="flex-column gap">
                        <label>Impératif</label>
                        <Toggle
                            label="Présent"
                            title="IMPERATIF_PRESENT"
                            checked={tenses['IMPERATIF_PRESENT']}
                            onChange={handleToggleTense}
                        />
                    </div>
                </div>
                <div className="flex space-between gap">
                    <Button text="Back" icon={<ArrowBackIcon />} link="/" type='purple' />
                    {/* <Button
                        text="Import"
                        type="purple"
                    />
                    <Button
                        text="Export"
                        type="purple"
                    /> */}
                    <Button
                        text="Create"
                        type="yellow"
                        onClick={handleCreateGame}
                        icon={<ArrowForwardIcon />}
                    />
                </div>
            </form>
        </>
    );
};

export default CreateGame;