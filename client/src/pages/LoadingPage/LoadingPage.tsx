import LoadingElement from '../../components/LoadingElement/LoadingElement';

import styles from './LoadingPage.module.css';

const LoadingPage = () => {
    return (
        <div className={`${styles.wrapper} center-flex align-items-center`}>
            <LoadingElement />
        </div>
    );
};

export default LoadingPage;