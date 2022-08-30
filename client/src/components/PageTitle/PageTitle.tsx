import { ReactElement } from 'react';
import Logo from '../Logo/Logo';
import styles from './PageTitle.module.css';

type PageTitleProps = {
    title: string;
    icon: ReactElement;
};

const PageTitle = ({ title, icon }: PageTitleProps) => {
    return (
        <div className="space-between align-items-center">
            <Logo size="small" />
            <div className={`${styles.title} center-flex align-items-center gap`}>
                {{...icon, props: { style: { fontSize: '40px' }}}} <h2>{title}</h2>
            </div>
        </div>
    );
};

export default PageTitle;