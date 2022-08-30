import { ReactNode } from 'react';
import styles from './Background.module.css';

export type BackgroundProps = {
    children: ReactNode;
}

const Background = ({ children }: BackgroundProps) => {
    return (
        <div id={styles.background}>
            {children}
        </div>
    );
};

export default Background;