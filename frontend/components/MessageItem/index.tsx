import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';
import styles from './messageItem.module.css'

const MessageItem = ({ name, avatar, timestamp, content, url }) => {
    return (

        <ListItem className={styles.messageItem}>
            <ListItemAvatar className={styles.avatar}>
                <Avatar alt={name} src={avatar} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <React.Fragment>
                        <Typography variant="body1" component="span" className={styles.nickname}>
                            {name}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            display="inline"
                            className={styles.timestamp}
                        >
                            {`${new Date(timestamp).toLocaleDateString()} ${new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                        </Typography>
                    </React.Fragment>
                }
                secondary={
                    <a href={url} className={styles.link}>
                        <Typography variant="body1" className={styles.content}>
                            {content}
                        </Typography>
                    </a>
                }
            />
        </ListItem>

    );
};

export default MessageItem;
