import React from 'react';
import { TicketMessageResponse, TicketMessageSenderRole } from '../../../types/Ticket.types';
import { formatDate } from '../../../utils/Formatting.utils';

type TicketChatBubbleProps = {
  message: TicketMessageResponse;
  userType: 'SUPPORT' | 'USER';
  userName: string;
};

const getSenderLabel = (role: TicketMessageSenderRole, userName: string) => {
  switch (role) {
    case 'USER':
      return userName;
    case 'SUPPORT':
      return `IT-Team (${userName})`;
    default:
      return 'Unbekannter Absender';
  }
};

export const TicketChatBubble: React.FC<TicketChatBubbleProps> = ({ message, userType, userName }) => {
  const isCurrentUser = message.senderRole === userType;
  const sender = getSenderLabel(message.senderRole, userName);

  return (
    <div className={`flex w-full gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
          isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-zinc-100'
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
