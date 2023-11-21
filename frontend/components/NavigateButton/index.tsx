import React, { ReactNode } from 'react';
import { Button, Typography } from '@mui/material';
import styles from './navigateButton.module.css';


interface NavigateButtonProps {
    icon: ReactNode;
    text: string;
    handleClick: () => void;
}

const NavigateButton = ({ icon, text, handleClick }: NavigateButtonProps) => {
    return (
        <Button
            className={styles.NavButton}
            onClick={handleClick}
        >
            <div className={styles.iconFrame}>{icon}</div>
            <div className={styles.textContainer}>
                <Typography className={styles.textContent}>
                    {text}
                </Typography>
            </div>

        </Button>

    );
};

export default NavigateButton;
