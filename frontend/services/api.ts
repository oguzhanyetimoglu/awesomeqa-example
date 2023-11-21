const BASE_URL = 'http://0.0.0.0:5001'; // Replace with your actual backend URL

interface TicketModel {
    id: string;
    msg_id: string;
    status: string;
    resolved_by?: string;
    ts_last_status_change?: string;
    timestamp: string;
    context_messages: string[];
}

interface MessageModel {
    id: string;
    channel_id: string;
    parent_channel_id: string | null;
    community_server_id: string;
    timestamp: string;
    has_attachment: boolean;
    reference_msg_id: string | null;
    timestamp_insert: string;
    discussion_id: string;
    author_id: string;
    content: string;
    msg_url: string;
    author: {
        id: string;
        name: string;
        nickname: string;
        color: string;
        discriminator: string;
        avatar_url: string;
        is_bot: boolean;
        timestamp_insert: string;
    };
}

export const getTickets = async (limit: number = 20): Promise<TicketModel[]> => {
    const response = await fetch(`${BASE_URL}/tickets?limit=${limit}`, {
        method: 'GET',
    });
    return response.json();
};

export const resolveTicket = async (ticketId: string): Promise<TicketModel> => {
    const response = await fetch(`${BASE_URL}/tickets/resolve?ticket_id=${ticketId}`, {
        method: 'PUT',
    });
    return response.json();
};

export const deleteTicket = async (ticketId: string): Promise<TicketModel> => {
    const response = await fetch(`${BASE_URL}/tickets/delete?ticket_id=${ticketId}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const getMessages = async (ticketId: string): Promise<MessageModel[]> => {
    const response = await fetch(`${BASE_URL}/tickets/get_messages?ticket_id=${ticketId}`, {
        method: 'GET',
    });
    return response.json();
};