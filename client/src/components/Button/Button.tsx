import { MouseEventHandler } from 'react';
import { ReactElement, CSSProperties } from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';

type ButtonProps = {
    className?: string;
    id?: string;
    style?: CSSProperties;
    icon?: ReactElement;
    text: string;
    onClick?: MouseEventHandler<HTMLElement>;
    link?: string;
    tooltip?: string;
    type?: 'yellow' | 'purple' | 'white' | 'clear';
    disabled?: boolean;
    stopPropogation?: boolean;
    align?: 'left' | 'center' | 'right';
};

const Button = ({ className = '', id = '', style = {}, icon, text, onClick, link, tooltip, disabled = false, type = 'clear', stopPropogation = false, align = 'left' }: ButtonProps) => {
    return link ? (
        <Link
            className={`${styles.button} ${styles[type]} ${disabled && styles.disabled} ${styles[className]}`}
            id={styles[id]}
            to={link}
            style={style}
            role="button"
            onClick={e => {
                if (stopPropogation) {
                    e.stopPropagation();
                }
            }}
            title={tooltip}
        >
            <span className={`${align}-flex align-items-center`}><>{icon} {text}</></span>
        </Link>
    )
    : (
        <span
            className={`${styles.button} ${styles[type]} ${disabled && styles.disabled} ${styles[className]} ${align}-flex align-items-center`}
            id={styles[id]}
            style={style}
            role="button"
            tabIndex={0}
            onClick={e => {
                if (stopPropogation) {
                    e.stopPropagation();
                }
                
                if (!disabled && onClick) {
                    onClick(e);
                }
            }}
            title={tooltip}
        >
            <>{icon} {text}</>
        </span>
    );
};

export default Button;