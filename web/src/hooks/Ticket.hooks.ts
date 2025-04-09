import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createTicket, getTicket, getTicketMessages, getTicketsByUser, sendMessageToTicket, updateTicket } from '../service/Ticket.service';
import { SendTicketMessageRequest, TicketMessageResponse, TicketResponse } from '../types/Ticket.types';

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
  return useMutation((payload: SendTicketMessageRequest) =>
    sendMessageToTicket(payload)
  );
};
