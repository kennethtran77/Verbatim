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
import Response from "../../../../server/src/models/response";
import { useServices } from "../../contexts/services";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import { Duration } from "../../../../server/src/models/game";
import { tenseNames, TenseValue } from "../../models/tenses";
import ConjugationRaceForm, { Tenses } from "./ConjugationRaceForm/ConjugationRaceForm";

const gameItems: DropdownElement[] = [
    {
        value: "conjugation-race",
        display: "Conjugation Race"
    }
];

const CreateGame = () => {
    const { getApi } = useServices();

    const navigate = useNavigate();

    const [modalMessage, setModalMessage] = useState('');

    const [maxPlayers, setMaxPlayers] = useState(30);
    const [gamemode, setGamemode] = useState(gameItems[0]);
    const [gametime, setGametime] = useState<Duration>({ minutes: 1, seconds: 30 });
    const [tenses, setTenses] = useState<Tenses>(tenseNames.reduce((prev: Tenses, curr: TenseValue) => ({ ...prev, [curr]: false, 'PRESENT': true }), {} as Tenses));

    const handleGameTimeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setGametime(prev => ({ ...prev, [e.target.title]: Number(e.target.value) })), []);

    const handleMaxPlayersChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setMaxPlayers(Number(e.target.value)), []);

    const handleToggleTense = useCallback((e: ChangeEvent<HTMLInputElement>) => setTenses((prev: Tenses) => {
        const currentTense = e.target.title as TenseValue;

        // do not do anything if the current tense is the only one selected
        if (prev[currentTense] && Object.keys(prev).every((tense) => tense === currentTense || !prev[tense as TenseValue])) {
            return prev;
        }

        return { ...prev, [currentTense]: !prev[currentTense] };
    }), []);

    const handleCreateGame = useCallback(async () => {
        const res: Response<string> = await getApi().createGame(gamemode.value, gametime, Object.keys(tenses).filter(tense => tenses[tense as TenseValue]), maxPlayers);

        if (!res.success) {
            setModalMessage(res.message);
        } else {
            const gameCode = res.data;
            navigate(`/game/${gameCode}`);
        }
    }, [gamemode, gametime, tenses, getApi, navigate, maxPlayers]);

    const labelStyle = { marginTop: '10px', fontWeight: 'bold' };

    const getCreateGameForm = () => {
        switch (gamemode.value) {
            case "conjugation-race":
                return <ConjugationRaceForm
                    handleGameTimeChange={handleGameTimeChange}
                    handleToggleTense={handleToggleTense}
                    labelStyle={labelStyle}
                    gametime={gametime}
                    tenses={tenses}
                />;
            default:
                return <></>;
        }
    };

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
                { getCreateGameForm() }
                <div className="flex space-between gap" style={{ marginTop: '15px' }}>
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