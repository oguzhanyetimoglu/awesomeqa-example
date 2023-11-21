import React, { useEffect, useState } from 'react';
import { getTickets, resolveTicket, deleteTicket } from '../../services/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Avatar, Button, CardHeader } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import AlertDialog from '../AlertDialog';
import TicketDialog from '../TicketDialog';

import styles from './ticketTable.module.css';

export default function TicketTable() {
    const [tickets, setTickets] = useState([]);
    const [openTicketDialog, setOpenTicketDialog] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [confirmAlertDialog, setConfirmAlertDialog] = useState({
        open: false,
        title: '',
        content: '',
        onConfirm: () => { },
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const result = await getTickets();
            setTickets(result);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const handleCellClick = (params) => {
        if (params.field !== 'resolve' && params.field !== 'delete') {
            setSelectedTicket(params.row);
            setOpenTicketDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenTicketDialog(false);
        setSelectedTicket(null);
    };

    const handleResolve = async (id) => {
        await resolveTicket(id);
        fetchTickets();
    };

    const confirmResolve = (id) => {
        setConfirmAlertDialog({
            open: true,
            title: 'Confirm Resolve',
            content: 'Are you sure you want to resolve?',
            onConfirm: () => {
                handleResolve(id);
                setConfirmAlertDialog({ ...confirmAlertDialog, open: false });
            },
        });
    };

    const handleDelete = async (id) => {
        await deleteTicket(id);
        fetchTickets();
    };

    const confirmDelete = (id) => {
        setConfirmAlertDialog({
            open: true,
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete?',
            onConfirm: () => {
                handleDelete(id);
                setConfirmAlertDialog({ ...confirmAlertDialog, open: false });
            },
        });
    };


    const columns: GridColDef[] = [
        {
            field: 'msg.author.nickname',
            headerName: 'Author',
            width: 200,
            headerAlign: 'center',
            sortable: false,
            renderCell: ({ row }) => (
                <CardHeader
                    avatar={
                        <Avatar
                            alt={row.msg.author.nickname}
                            src={row.msg.author.avatar_url}
                        />
                    }
                    title={row.msg.author.nickname}
                />
            ),
        },
        {
            field: 'msg.content',
            headerName: 'Content',
            flex: 1,
            headerAlign: 'center',
            sortable: true,
            renderCell: ({ row }) => (
                <div className={styles.content}>
                    {row.msg.content}
                </div>
            ),
        },
        {
            field: 'status',
            headerName: 'Status',
            headerAlign: 'center',
            sortable: true,
            renderCell: ({ row }) => (
                <div className={`${styles.status} ${row.status === 'open' ? '' : styles.statusClosed}`}>
                    {row.status}
                </div >
            ),
        },
        {
            field: 'timestamp',
            headerName: 'Created',
            width: 150,
            headerAlign: 'center',
            sortable: true,
            valueGetter: (params: { value: string }) => {
                const timestamp = params.value;
                return formatTimestamp(timestamp);
            },
        },
        {
            field: 'resolve',
            headerName: '',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <Button className={`${styles.actionButton} ${styles.resolve}`}
                    onClick={() => confirmResolve(params.row.id)}
                    disabled={params.row.status === 'resolved'}
                >
                    <MarkChatReadIcon fontSize="small" />
                </Button>
            ),
        },
        {
            field: 'delete',
            headerName: '',
            width: 80,
            sortable: false,
            renderCell: (params) => (
                <Button
                    className={`${styles.actionButton} ${styles.delete}`}
                    onClick={() => confirmDelete(params.row.id)}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </Button>
            ),
        }
    ];


    const formatTimestamp = (timestamp: string) => {
        const parsedDate = new Date(timestamp);
        return parsedDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    return (
        <div>
            <DataGrid
                rows={tickets}
                columns={columns}
                disableRowSelectionOnClick
                checkboxSelection={false}
                onCellClick={handleCellClick}
                autoHeight
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                pageSizeOptions={[10, 20, 50, 100]}
            />
            <TicketDialog
                open={openTicketDialog}
                onClose={handleCloseDialog}
                ticket={selectedTicket}
            />
            <AlertDialog
                open={confirmAlertDialog.open}
                title={confirmAlertDialog.title}
                content={confirmAlertDialog.content}
                onConfirm={confirmAlertDialog.onConfirm}
                onCancel={() => setConfirmAlertDialog({ ...confirmAlertDialog, open: false })}
            />
        </div>
    );
}