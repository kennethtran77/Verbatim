import { ReactElement, ReactNode, useId, useState } from 'react';
import styles from './Input.module.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { CSSProperties } from 'react';
import { MouseEventHandler } from 'react';

type InputProps = {
    label: ReactNode;
    breakLine?: boolean;
    icon?: ReactElement;
    className?: string;
    type?: 'text' | 'password' | 'number';
    style?: CSSProperties;
    labelStyle?: CSSProperties;
    onClick?: MouseEventHandler<HTMLElement>;
    hideLabel?: boolean;
    [x: string]: any;
}

const Input = (props: InputProps) => {
    const { label, breakLine = true, icon, type = 'text', style, labelStyle, hideLabel = false, onClick = () => {}, ...inputProps } = props;
    const [state, setState] = useState('');
    const [visible, setVisibile] = useState(false);
    const id = useId();

    const getType = () => {
        if (type === 'password') {
            return visible ? 'text' : 'password';
        } else {
            return type;
        }
    };

    const handleBlur = () => {
        setState('');
    };

    const handleFocus = () => {
        setState('active');
    };

    return (
        <div className={`${breakLine ? 'flex-column' : 'flex gap align-items-center'}`} style={style}>
            <label htmlFor={id} style={{ ...labelStyle, display: hideLabel ? 'none' : 'auto' }}>{label}</label>
            <div className={`${props.className} ${styles.input} ${styles[state]} space-around`} onBlur={handleBlur} onFocus={handleFocus} onClick={onClick}>
                <input
                    id={id}
                    type={getType()}
                    { ...inputProps }
                />
                { type === 'password' &&
                    <span className={`${styles.icon} h-margin center-flex`} onClick={() => setVisibile(prev => !prev)}>
                        { visible ? <VisibilityOffIcon/> : <VisibilityIcon /> }
                    </span>
                }
            </div>
        </div>
    );
};

export default Input;