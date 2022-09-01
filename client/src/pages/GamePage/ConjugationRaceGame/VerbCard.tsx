import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Card from '../../../components/Card/Card';

import { Subject, Verb } from '../../../../../server/src/models/conjugation_race';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import Input from '../../../components/Input/Input';
import { ChangeEvent } from 'react';
import Button from '../../../components/Button/Button';

import LoopIcon from '@mui/icons-material/Loop';

export type VerbCardProps = {
    verb: Verb;
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => any;
    handleSubmit: () => void;
    handleSkip: () => void;
    correctAnswer?: string;
};

const getGenderIcon = (subject: Subject) => {
    switch (subject) {
        case "elle":
        case "elles":
            return <span title="Feminine"><FemaleIcon style={{ fontSize: '40px' }} /></span>;
        default:
            return <span title="Masculine"><MaleIcon style={{ fontSize: '40px' }} /></span>;
    };
};

const getPluralityIcon = (subject: Subject) => {
    switch (subject) {
        case "ils":
        case "elles":
        case "nous":
        case "on":
        case "vous":
            return <span title="Plural"><GroupIcon style={{ fontSize: '40px' }} /></span>;
        default:
            return <span title="Singular"><PersonIcon style={{ fontSize: '40px' }} /></span>;
    };
};

const VerbCard = ({ verb, value, handleChange, handleSubmit, handleSkip, correctAnswer = '' }: VerbCardProps) => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Card
            icon={<AccessTimeIcon style={{ fontSize: '40px' }} />}
            header={<h3 style={{ margin: 0 }}>{verb.tense.display}</h3>}
            cardStyle={{
                minWidth: '500px',
                maxWidth: '700px',
                height: '380px',
                maxHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
            }}
            bodyStyle={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
            }}
        >
            <div className="center-flex align-items-center" style={{ fontSize: '24px', marginTop: '20px', marginBottom: '20px', gap: '20px' }}>
                { verb.subject }
                { getGenderIcon(verb.subject) }
                { getPluralityIcon(verb.subject) }
                { verb.pronominal && <span title="Pronominal"><LoopIcon style={{ fontSize: '40px' }} /></span>}
            </div>
            <Input
                label={"Verb Input"}
                breakLine
                value={value}
                onChange={handleChange}
                autoComplete="off"
                hideLabel
                onKeyDown={handleKeyDown}
            />
            <span className="center-flex" style={{ fontSize: '24px', marginTop: '10px', marginBottom: '10px' }}>{verb.infinitive}</span>
            <div style={{ marginTop: 'auto' }}>
                { correctAnswer && <span><strong>Correct Answer</strong>: {correctAnswer}</span>}
                <span className="space-between gap" style={{ marginTop: '10px' }}>
                    <Button
                        text="Skip"
                        type="purple"
                        onClick={handleSkip}
                        align="center"
                        style={{ width: '40%' }}
                    />
                    <Button
                        text="Submit"
                        type='yellow'
                        onClick={handleSubmit}
                        align="center"
                        style={{ width: '40%' }}
                    />
                </span>
            </div>
        </Card>
    );
};

export default VerbCard;