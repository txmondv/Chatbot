import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addTicketNote, assignSupporterToTicket, createTicket, getAllSupporters, getByStatus, getTicket, getTicketMessages, getTicketNotes, getTicketsByUser, removeTicketNote, sendMessageToTicket, unassignSupporterFromTicket, updateTicket, updateTicketStatus } from '../service/Ticket.service';
import { AddNoteRequest, AssignSupporterRequest, SendTicketMessageRequest, TicketMessageResponse, TicketNote, TicketResponse, TicketStatus, UnassignSupporterRequest, UpdateTicketStatusRequest } from '../types/Ticket.types';
import { getCategories } from '../service/System.service';
import { User } from '../types/User.types';

export const useUserTickets = () => {
  return useQuery({
    queryKey: ['userTickets'],
    queryFn: getTicketsByUser
  });
};

export const useCreateTicket = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['userTickets']);
      if (onSuccess) onSuccess();
    },
  });
};


export const useUpdateTicket = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      queryClient.invalidateQueries(['userTickets']);
      queryClient.invalidateQueries(['ticket']);
      if (onSuccess) onSuccess();
    },
  });
};

export const useTicket = (ticketId: number) => {
  return useQuery<TicketResponse>(
    ['ticket', ticketId],
    () => getTicket(ticketId),
    {
      enabled: !!ticketId,
    }
  );
};

export const useTicketChat = (chatId: number) => {
  return useQuery<TicketMessageResponse[]>(
    ['ticket-chat', chatId],
    () => getTicketMessages(chatId),
    {
      enabled: !!chatId,
    }
  );
};

export const useSendTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SendTicketMessageRequest) => sendMessageToTicket(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-chat']);
    },
  });
};

export const useTicketNotes = (ticketId: number) => {
  return useQuery<TicketNote[]>(
    ['ticket-notes', ticketId],
    () => getTicketNotes(ticketId),
    {
      enabled: !!ticketId,
    }
  );
};

export const useAddTicketNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddNoteRequest) => addTicketNote(request),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries(['ticket-notes', ticketId]);
    },
  });
};

export const useRemoveTicketNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: number) => removeTicketNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-notes']);
    },
  });
};

export const useAssignSupporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AssignSupporterRequest) => assignSupporterToTicket(request),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries(['ticket', ticketId]);
      queryClient.invalidateQueries(['userTickets']);
    },
  });
};

export const useUnassignSupporter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UnassignSupporterRequest) => unassignSupporterFromTicket(request),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries(['ticket', ticketId]);
      queryClient.invalidateQueries(['userTickets']);
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateTicketStatusRequest) => updateTicketStatus(request),
    onSuccess: (_, { ticketId }) => {
      queryClient.invalidateQueries(['ticket', ticketId]);
      queryClient.invalidateQueries(['userTickets']);
    },
  });
};

export const useTicketsByStatus = (status: TicketStatus) => {
  return useQuery<TicketResponse[]>(
    ['support-tickets', status],
    () => getByStatus(status),
    {
      enabled: !!status,
    }
  );
};


export const useTicketCategories = () => {
  return useQuery<string[]>(
    ['ticketCategories'],
    () => getCategories()
  );
};

export const useAllSupporters = () => {
  return useQuery<User[]>(
    ['allSupporters'],
    () => getAllSupporters()
  );
};