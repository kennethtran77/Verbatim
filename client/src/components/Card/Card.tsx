import { CSSProperties, ReactNode } from "react";

import styles from './Card.module.css';

export type CardProps = {
    cardStyle?: CSSProperties;
    bodyStyle?: CSSProperties;
    icon?: ReactNode;
    header?: ReactNode;
    body?: ReactNode;
    children?: ReactNode;
}

const Card = ({ cardStyle = {}, bodyStyle = {}, icon, header, children }: CardProps) => {
    return (
        <div className={styles.card} style={cardStyle}>
            <span className={`left-flex align-items-center gap ${styles.header}`}>{icon} {header}</span>
            <div className={styles.body} style={bodyStyle}>
                {children}
            </div>
        </div>
    );
};

export default Card;