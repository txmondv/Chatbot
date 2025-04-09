import React from 'react';
import { TicketMessageResponse, TicketMessageSenderRole } from '../../../types/Ticket.types';
import { formatDate } from '../../../utils/Formatting.utils';

type TicketChatBubbleProps = {
  message: TicketMessageResponse;
};

const getSenderLabel = (role: TicketMessageSenderRole) => {
  switch (role) {
    case 'USER':
      return 'Du';
    case 'SUPPORT':
      return 'IT-Team';
    default:
      return 'Unbekannter Absender';
  }
};

export const TicketChatBubble: React.FC<TicketChatBubbleProps> = ({ message }) => {
  const isUser = message.senderRole === 'USER';
  const sender = getSenderLabel(message.senderRole);

  return (
    <div className={`flex w-full gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
          isUser ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-100'
        }`}
      >
        <div className="text-xs text-zinc-300 mb-1">{sender}</div>
        <div>{message.content}</div>
        <div className="text-[10px] text-zinc-300 mt-1 text-right">
          {formatDate(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
