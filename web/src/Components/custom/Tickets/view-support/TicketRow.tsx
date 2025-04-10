import { useNavigate } from "react-router";
import { TicketResponse } from "../../../../types/Ticket.types";
import { statusLabels } from "../../../../utils/Ticket.util";


interface TicketRowProps {
  ticket: TicketResponse;
}

export const TicketRow = ({ ticket }: TicketRowProps) => {
  const navigate = useNavigate();

  const truncatedDescription =
    ticket.description.length > 80
      ? `${ticket.description.slice(0, 80)}...`
      : ticket.description;

  return (
    <tr
      onClick={() => navigate(`/requests/${ticket.id}`)}
      className="hover:bg-zinc-800 transition border-b border-zinc-700 cursor-pointer"
    >
      <td className="p-3 text-cyan-300 font-semibold">{ticket.title}</td>
      <td className="p-3 text-zinc-300">{truncatedDescription}</td>
      <td className="p-3 text-zinc-400">{ticket.category || 'Keine'}</td>
      <td className="p-3">
        <span className="px-2 py-1 text-xs rounded bg-cyan-600 text-zinc-100 font-medium">
          {statusLabels[ticket.status]}
        </span>
      </td>
      <td className="p-3 text-zinc-400">
        {ticket.supporterIds.length > 0
          ? ticket.supporterIds.join(', ')
          : 'Nicht zugewiesen'}
      </td>
      <td className="p-3 text-zinc-500 italic">{ticket.userName}</td>
    </tr>
  );
};
