import React, { KeyboardEvent, useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import { useSendTicketMessage, useTicketChat } from '../../../hooks/Ticket.hooks';
import { TicketChatBubble } from './TicketChatBubble';

interface TicketChatAreaProps {
  ticketId: number;
  chatId: number;
  userType: 'SUPPORT' | 'USER';
}

const TicketChatArea: React.FC<TicketChatAreaProps> = ({ ticketId, chatId, userType }) => {
  const { data: chatMessages, isLoading } = useTicketChat(chatId);
  const sendMessage = useSendTicketMessage();
  const [message, setMessage] = useState('');

  async function handleSendMessage() {
    if (sendMessage.isLoading || !message.trim()) return;
    sendMessage.mutate({
      content: message,
      ticketId: ticketId
    });
    setMessage('');
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const noMessagesText = userType === 'SUPPORT'
    ? 'Noch keine Nachrichten in diesem Ticket. Antworten Sie dem Benutzer, um zu helfen.'
    : 'Es gibt noch keine Nachrichten in diesem Ticket. Wir werden uns so schnell wie möglich um dein Anliegen kümmern. Solltest du noch weitere Fragen oder Anmerkungen für das IT-Team haben, schreibe uns gerne hier eine Nachricht!';

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-2 mb-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <ClipLoader color="#22d3ee" size={30} />
          </div>
        ) : (
          <>
            {(chatMessages || []).map((msg) => (
              <TicketChatBubble
                key={msg.id}
                message={msg}
                userType={userType}
                userName={msg.senderName}
              />
            ))}
            {chatMessages?.length === 0 && (
              <div className="text-zinc-300 text-center py-8">
                {noMessagesText}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center border-t border-zinc-700 pt-3">
        <input
          type="text"
          className="flex-1 bg-gray-700 p-3 rounded-l-md outline-none text-white"
          placeholder="Nachricht senden..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 p-4 rounded-r-md"
          disabled={sendMessage.isLoading}
        >
          {sendMessage.isLoading ? <ClipLoader color="#fff" size={20} /> : <FaPaperPlane className="text-white" />}
        </button>
      </div>
    </div>

  );
};

export default TicketChatArea;
