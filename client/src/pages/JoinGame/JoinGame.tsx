import { ChangeEvent, SyntheticEvent, useState } from "react";
import PageTitle from "../../components/PageTitle/PageTitle";
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { useCallback } from "react";
import { useServices } from "../../contexts/services";
import Response from "../../../../server/src/models/response";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
    const { getApi } = useServices();
    const navigate = useNavigate();

    const [gameCode, setGameCode] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const handleEnter = useCallback(async () => {
        // check if a game with given code exists
        const res: Response<string> = await getApi().getGameStatus(gameCode);

        if (res.data !== 'waiting') {
            setModalMessage(res.message);
        } else {
            navigate(`/game/${gameCode}`);
        }
    }, [gameCode, getApi, navigate]);

    const handleCodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => setGameCode(e.target.value), []);

    const handleSubmitForm = useCallback((e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleEnter();
    }, [gameCode, getApi]);

    return (
        <>
            <Modal active={Boolean(modalMessage.length)} setActive={(state: boolean) => state ? {} : setModalMessage('')}>{modalMessage}</Modal>
            <PageTitle icon={<PlayForWorkIcon />} title="Join Game" />
            <form onSubmit={handleSubmitForm}>
                <Input
                    label={<h1 style={{ textAlign: 'center' }}>Game Code</h1>}
                    breakLine={true}
                    value={gameCode}
                    onChange={handleCodeChange}
                    autoComplete="off"
                />
                <div className="space-between gap v-margin">
                    <Button text="Back" icon={<ArrowBackIcon />} link="/" type='purple' />
                    <Button text="Enter" icon={<ArrowForwardIcon />} type='yellow' onClick={handleEnter} />
                </div>
            </form>
        </>
    );
};

export default JoinGame;