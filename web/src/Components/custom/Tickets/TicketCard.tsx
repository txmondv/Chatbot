import { FaTrash } from 'react-icons/fa';
import { TicketResponse } from '../../../types/Ticket.types';

interface TicketCardProps {
  ticket: TicketResponse;
  onOpen: () => void;
  onDelete: () => void;
}

export const TicketCard = ({ ticket, onOpen, onDelete }: TicketCardProps) => {
  return (
    <div
      onClick={onOpen}
      className="relative bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer p-4 rounded-xl shadow-md group"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-bold text-cyan-400">{ticket.title}</h2>
        <span className="bg-cyan-400 text-zinc-900 text-xs font-semibold px-2 py-1 rounded">
          {ticket.status}
        </span>
      </div>

      <p className="text-sm text-zinc-300">{ticket.description}</p>
      <div className="mt-2 text-xs text-zinc-400">Kategorie: {ticket.category != "" ? ticket.category : "Keine"}</div>

      <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 rounded hover:bg-zinc-600 transition"
          title="Löschen"
        >
          <FaTrash className="text-red-400" />
        </button>
      </div>
    </div>
  );
};
