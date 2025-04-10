import {
    AddNoteRequest,
    AssignSupporterRequest,
    SendTicketMessageRequest,
    TicketCreationRequest,
    TicketMessageResponse,
    TicketNote,
    TicketResponse,
    TicketStatus,
    UnassignSupporterRequest,
    UpdateTicketRequest,
    UpdateTicketStatusRequest
} from '../types/Ticket.types';
import { User } from '../types/User.types';
import { FetchWrapper } from '../utils/FetchWrapper';


export const getTicket = async (ticketId: number): Promise<TicketResponse> =>
    FetchWrapper.get<TicketResponse>(`/api/tickets/${ticketId}`);

export const getTicketsByUser = async (): Promise<TicketResponse[]> =>
    FetchWrapper.get<TicketResponse[]>('/api/tickets');

export const createTicket = async (request: TicketCreationRequest): Promise<TicketResponse> =>
    FetchWrapper.post<TicketResponse>('/api/tickets/create', request);

export const getTicketMessages = async (ticketId: number): Promise<TicketMessageResponse[]> => 
    FetchWrapper.get<TicketMessageResponse[]>(`/api/tickets/${ticketId}/messages`)

export const sendMessageToTicket = async (request: SendTicketMessageRequest): Promise<void> =>
    FetchWrapper.post<void>('/api/tickets/message', request);

export const updateTicket = async (request: UpdateTicketRequest): Promise<TicketResponse> =>
    FetchWrapper.patch<TicketResponse>('/api/tickets/update', request);

export const deleteTicket = async (ticketId: number): Promise<void> =>
    FetchWrapper.delete<void>(`/api/tickets/delete/${ticketId}`);

/////////////////////////////
////        NOTES        ////
/////////////////////////////

export const getTicketNotes = async (ticketId: number): Promise<TicketNote[]> => 
    FetchWrapper.get<TicketNote[]>(`/api/tickets/notes/${ticketId}`)

export const addTicketNote = async (request: AddNoteRequest): Promise<void> => 
    FetchWrapper.post<void>(`/api/tickets/notes/add`, request)

export const removeTicketNote = async (ticketId: number): Promise<void> => 
    FetchWrapper.delete<void>(`/api/tickets/notes/delete/${ticketId}`)

/////////////////////////////
////       SUPPORT       ////
/////////////////////////////

export const getByStatus = async (status: TicketStatus): Promise<TicketResponse[]> =>
    FetchWrapper.get<TicketResponse[]>(`/api/tickets/support/getByStatus/${status}`);

export const updateTicketStatus = async (request: UpdateTicketStatusRequest): Promise<TicketResponse> =>
    FetchWrapper.patch<TicketResponse>('/api/tickets/support/setStatus', request);

export const assignSupporterToTicket = async (request: AssignSupporterRequest): Promise<TicketResponse> =>
    FetchWrapper.post<TicketResponse>('/api/tickets/support/assign-supporter', request);

export const unassignSupporterFromTicket = async (request: UnassignSupporterRequest): Promise<TicketResponse> =>
    FetchWrapper.post<TicketResponse>('/api/tickets/support/unassign-supporter', request);

export const getAllSupporters = async (): Promise<User[]> =>
    FetchWrapper.get<User[]>(`/api/tickets/support/getAllSupporters`);