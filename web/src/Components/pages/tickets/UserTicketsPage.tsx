import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ClipLoader } from 'react-spinners';
import { useUserTickets } from '../../../hooks/Ticket.hooks';
import { TicketCard } from '../../custom/Tickets/TicketCard';
import { TicketModal } from '../../custom/Tickets/TicketModal';
import ServerErrorPage from '../lib/ServerErrorPage';
import { deleteTicket } from '../../../service/Ticket.service';

export const UserTicketsPage = () => {
  const { data: tickets, isLoading, isError, refetch } = useUserTickets();
  const navigate = useNavigate();

  const [isCreateOpen, setCreateOpen] = useState(false);

  const handleCloseModal = () => {
    setCreateOpen(false);
  };

  const handleDeleteTicket = async (ticketId: number) => {
          if (window.confirm("Bist du sicher, dass du dieses Ticket löschen möchtest?")) {
              await deleteTicket(ticketId);
              refetch()
          }
      };

  if (isError) {
    return <ServerErrorPage message="Fehler beim Laden der Tickets" />;
  }

  return (
    <div className="bg-zinc-900 min-h-screen p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Meine Tickets</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-cyan-400 text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-cyan-300 transition"
        >
          Neues Ticket
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center mt-20">
          <ClipLoader color="#22d3ee" size={50} />
        </div>
      )}

      {!isLoading && !isError && tickets?.length === 0 && (
        <div className="text-center mt-20 text-zinc-400 text-lg">
          Du hast noch keine Tickets erstellt.
        </div>
      )}

      {!isLoading && tickets && tickets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onOpen={() => navigate(`/tickets/${ticket.id}`)}
              onDelete={() => handleDeleteTicket(ticket.id)}
            />
          ))}
        </div>
      )}

      <TicketModal
        isOpen={isCreateOpen}
        onClose={handleCloseModal}
        mode="create"
      />
    </div>
  );
};
