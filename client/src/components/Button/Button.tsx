import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';

type ButtonProps = {
    icon?: ReactElement;
    text: string;
    onClick?: Function;
    link?: string;
    tooltip?: string;
    type?: 'yellow' | 'purple' | 'white' | 'clear';
    disabled?: boolean;
    stopPropogation?: boolean;
    align?: 'left' | 'center' | 'right';
};

const Button = ({ icon, text, onClick, link, tooltip, disabled = false, type = 'clear', stopPropogation = false, align = 'left' }: ButtonProps) => {
    return link ? (
        <Link
            className={`${styles.button} ${styles[type]} ${disabled && styles.disabled}`}
            to={link}
            onClick={e => {
                if (stopPropogation) {
                    e.stopPropagation();
                }
            }}
            title={tooltip}
        >
            <span className={`${align}-flex`}><>{icon} {text}</></span>
        </Link>
    )
    : (
        <span
            className={`${styles.button} ${styles[type]} ${disabled && styles.disabled}`}
            role="button"
            tabIndex={0}
            onClick={e => {
                if (stopPropogation) {
                    e.stopPropagation();
                }
                
                if (!disabled && onClick) {
                    onClick();
                }
            }}
            title={tooltip}
        >
            <span className={`${align}-flex`}><>{icon} {text}</></span>
        </span>
    );
};

export default Button;