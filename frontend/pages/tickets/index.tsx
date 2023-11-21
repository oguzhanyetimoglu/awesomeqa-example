// TicketsPage.js
import React from 'react';
import TicketTable from '../../components/TicketTable';
import styles from './tickets.module.css'

const TicketPage = () => {
    return (
        <div className={styles.tableContainer}>
            <TicketTable />
        </div>
    );
};

export default TicketPage;
