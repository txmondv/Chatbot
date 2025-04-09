type TicketStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | "DISCARDED"

export type TicketMessageSenderRole =
    | "USER"
    | "SUPPORT"

export interface AssignSupporterRequest {
    ticketId: number;
    supporterId: number;
}

export interface SendTicketMessageRequest {
    ticketId: number;
    content: string;
}

export interface TicketCreationRequest {
    title: string;
    description: string;
    category?: string;
    userId?: number;
    chatId?: number;
}

export interface UnassignSupporterRequest {
    ticketId: number;
    supporterId: number;
}

export interface UpdateTicketRequest {
    ticketId: number;
    title?: string;
    description?: string;
    category?: string;
    status?: TicketStatus;
}

export interface UpdateTicketStatusRequest {
    ticketId: number;
    newStatus: TicketStatus;
}

export interface TicketResponse {
    id: number;
    title: string;
    description: string;
    category: string;
    userId: number;
    supporterIds: number[];
    chatId: number;
    status: TicketStatus;
}

export interface TicketMessageResponse {
    id: number;
    senderId: number;
    senderRole: TicketMessageSenderRole;
    content: string;
    timestamp: string;
}