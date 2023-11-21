import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    Paper,
    Typography
} from '@mui/material';
import { getMessages } from '../../services/api';
import MessageItem from '../../MessageItem';
import styles from './ticketDialog.module.css';

const TicketDialog = ({ open, onClose, ticket }) => {
    const [messages, setMessages] = useState([]);

    const fetchMessages = async () => {
        try {
            if (ticket) {
                const result = await getMessages(ticket.id);
                setMessages(result);
            }
        } catch (error) {
            console.error('Error fetching context messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [ticket]);

    if (!ticket) {
        return null;
    }

    const {
        id,
        status,
        timestamp,
        msg: {
            content: msgContent,
            msg_url: msgUrl,
            author: {
                nickname: authorNickname,
                avatar_url: authorAvatar,
            },
        },
    } = ticket;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                styles: {
                    backgroundColor: 'wrgb(52, 52, 52)',
                },
            }}
        >
            <DialogTitle>{`Ticket Details`}</DialogTitle>
            <DialogContent>
                <div>
                    <strong>Ticket ID:</strong> {id}
                </div>
                <div className={styles.statusContainer}>
                    <strong>Status:</strong>
                    <span>
                        <Paper
                            component={Box}
                            className={`${styles.statusPaper} ${status === 'open' ? '' : styles.statusPaperClosed}`}
                        >
                            <Typography className={styles.statusText}>{status}</Typography>
                        </Paper>
                    </span>
                </div>
                <hr className={styles.hrStyle} />
                <MessageItem
                    name={authorNickname}
                    avatar={authorAvatar}
                    timestamp={timestamp}
                    content={msgContent}
                    url={msgUrl}
                />
                <hr className={styles.hrStyle} />
                <div>
                    <strong>Context Messages:</strong>
                </div>
                <List>
                    {messages.map((message) => (
                        <MessageItem
                            name={message.author.nickname}
                            avatar={message.author.avatar_url}
                            timestamp={message.timestamp}
                            content={message.content}
                            url={message.msg_url}
                        />
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TicketDialog;
