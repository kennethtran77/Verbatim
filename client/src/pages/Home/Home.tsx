import React from 'react';
import Logo from '../../components/Logo/Logo';

import styles from './Home.module.css';

import CreateIcon from '@mui/icons-material/Create';
import PlayForWorkIcon from '@mui/icons-material/PlayForWork';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Button from '../../components/Button/Button';

const Home = () => {
    const iconStyle = { fontSize: '40px' };

    return (
        <div id={styles.home}>
            <Logo />
            <nav>
                <Button icon={<CreateIcon style={iconStyle} />} text='Create Game' link='/create' />
                <Button icon={<PlayForWorkIcon style={iconStyle} />} text='Join Game' link='/join' />
                <Button icon={<SettingsIcon style={iconStyle} />} text='Settings' link='/settings' />
                <Button icon={<HelpOutlineIcon style={iconStyle} />} text='About' link='/about' />
            </nav>
        </div>
    );
};

export default Home;