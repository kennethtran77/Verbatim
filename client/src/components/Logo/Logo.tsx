import styles from './Logo.module.css';

const Logo = () => {
    return (
        <div className={styles.logo}>
            <div id={styles.ellipse}/>
            <div id={styles.rectangle}>
                <h1>Verbatim</h1>
            </div>
            <div id={styles.triangle}/>
        </div>
    );
};

export default Logo;