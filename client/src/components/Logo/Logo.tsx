import styles from './Logo.module.css';

type LogoProps = {
    size?: 'big' | 'small';
};

const Logo = ({ size = 'big' }: LogoProps) => {
    return (
        <div className={`${styles[size]} ${styles.logo}`}>
            <div id={styles.ellipse}/>
            <div id={styles.rectangle}>
                <h1>{ size === 'big' ? 'Verbatim' : 'V' }</h1>
            </div>
            <div id={styles.triangle}/>
        </div>
    );
};

export default Logo;