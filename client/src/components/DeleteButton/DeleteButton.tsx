import ClearIcon from '@mui/icons-material/Clear';
import { MouseEventHandler } from 'react';

import styles from './DeleteButton.module.css';

type DeleteButtonProps = {
    onClick: MouseEventHandler<SVGSVGElement>;
    className?: string;
    ariaLabel?: string;
    tooltip?: string;
    disabled?: boolean;
    fontSize?: string;
    background?: boolean;
};

const DeleteButton = ({ onClick, ariaLabel, tooltip, disabled = false, fontSize = '20px', background = false, className }: DeleteButtonProps) => {
    return (
        <span
            title={tooltip}
            aria-label={ariaLabel}
            role='button'
            style={{
                margin: 0,
                padding: 0,
                lineHeight: 1,
                display: 'inline-block'
            }}
        >
            <ClearIcon
                tabIndex={0}
                className={`${styles['delete-button']} ${disabled && styles.disabled} ${background && styles.background} ${className}`}
                onClick={onClick}
                style={{
                    fontSize
                }}
            />
        </span>
    );
};

export default DeleteButton;