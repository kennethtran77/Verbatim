import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PercentIcon from '@mui/icons-material/Percent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import Card from '../Card/Card';

export type StatsCardProps = {
    seen: number;
    correct: number;
    incorrect: number;
    highlightCorrect?: boolean;
    highlightIncorrect?: boolean;
};

const StatsCard = ({ seen, correct, incorrect, highlightCorrect = false, highlightIncorrect = false }: StatsCardProps) => {
    const seenLabel = `${seen} Words Seen`;
    const correctLabel = `${correct} Words Correctly Answered`;
    const incorrectLabel = `${incorrect} Words Incorrectly Answered`;

    const ratio: number = Math.round((correct / incorrect) * 100) / 100
    const ratioLabel = `${ratio} Correct/Incorrect Ratio`;

    return (
        <Card
            icon={<AccessTimeIcon />}
            header={<h3 style={{ margin: 0 }}>Stats</h3>}
            cardStyle={{
                minWidth: '250px',
                minHeight: '300px'
            }}
        >
            <div className="flex-column gap">
                <span className="flex gap align-items-center" aria-label={seenLabel} title={seenLabel}><VisibilityIcon /> {seen}</span>
                <span className="flex gap align-items-center" aria-label={correctLabel} title={correctLabel} style={highlightCorrect ? { color: 'green' } : { color: 'black' }}><CheckCircleIcon /> {correct}</span>
                <span className="flex gap align-items-center" aria-label={incorrectLabel} title={incorrectLabel} style={highlightIncorrect ? { color: 'red' } : { color: 'black' }}><CancelIcon /> {incorrect}</span>
                <span className="flex gap align-items-center" aria-label={ratioLabel} title={ratioLabel}><PercentIcon /> {ratio}</span>
            </div>
        </Card>
    );
};

export default StatsCard;