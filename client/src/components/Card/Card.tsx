import { CSSProperties, ReactNode } from "react";

import styles from './Card.module.css';

export type CardProps = {
    cardStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
    icon?: ReactNode;
    header?: ReactNode;
    body?: ReactNode;
    headerAlign?: 'left' | 'center' | 'right';
    children?: ReactNode;
}

const Card = ({ cardStyle = {}, bodyStyle = {}, icon, header, headerAlign = 'left', children }: CardProps) => {
    return (
        <div className={styles.card} style={cardStyle}>
            <span className={`${headerAlign}-flex align-items-center gap ${styles.header}`}>{icon} {header}</span>
            <div className={styles.body} style={bodyStyle}>
                {children}
            </div>
        </div>
    );
};

export default Card;