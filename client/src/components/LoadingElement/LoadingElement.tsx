import styles from './LoadingElement.module.css';

const LoadingElement = () => {
    return (
        <div className={styles["dot-pulse"]} />
    );
};

export default LoadingElement;