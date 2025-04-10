import React from 'react';
import {
  AiOutlineClockCircle,
  AiOutlineCode,
  AiOutlineMessage,
} from 'react-icons/ai';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { useChatInfo } from '../../../hooks/Chat.hooks';
import { ClipLoader } from 'react-spinners';
import { getTitle } from '../../../utils/Chat.utils';
import { formatDate } from '../../../utils/Formatting.utils';

interface TicketChatPreviewProps {
  chatId: number;
}

const TicketChatPreview: React.FC<TicketChatPreviewProps> = ({
  chatId
}) => {
  const navigate = useNavigate();
  const { data: chat, isError, isLoading } = useChatInfo(chatId);

  if (isError) {
    return (
      <div className="flex justify-center mt-20 text-red-400">
        Fehler beim Laden der Chat-Informationen
      </div>
    );
  }

  return isLoading || !chat ? (
    <div className="flex justify-center mt-20">
      <ClipLoader color="#22d3ee" size={50} />
    </div>
  ) : (
    <section>
      <h3 className="text-lg font-medium text-zinc-300 mb-2">Verknüpfter Chat</h3>
      <div
        onClick={() => navigate(`/chats/${chatId}`)}
        className="p-4 hover:bg-zinc-600 bg-zinc-700 rounded-lg text-white transition flex justify-between items-center cursor-pointer"
      >
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-lg font-semibold flex items-center gap-2 w-full">
            <FiMessageSquare className="text-cyan-400" size={20} />
            <span className="truncate">{getTitle(chat.title)}</span>
          </div>

          <div className="flex gap-2 mt-3 text-sm text-gray-300 flex-wrap">
            <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
              <AiOutlineCode /> {chat.model}
            </span>
            <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
              <AiOutlineClockCircle /> {formatDate(chat.lastMessageAt)}
            </span>
            <span className="flex items-center gap-2 bg-zinc-900 px-3 py-1 rounded-md">
              <AiOutlineMessage /> {chat.messageCount}
            </span>
          </div>
        </div>
      </div>
    </section>

  );
};

export default TicketChatPreview;
