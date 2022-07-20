import Button from "../../components/Button/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateGame = () => {
    return (
        <>
            <Button text="Back" icon={<ArrowBackIcon />} link="/" />
        </>
    );
};

export default CreateGame;