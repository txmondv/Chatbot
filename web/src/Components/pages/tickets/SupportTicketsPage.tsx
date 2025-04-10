import { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { ClipLoader } from 'react-spinners';
import { getByStatus } from '../../../service/Ticket.service';
import { TicketStatus } from '../../../types/Ticket.types';
import { TicketRow } from '../../custom/Tickets/view-support/TicketRow';
import ServerErrorPage from '../lib/ServerErrorPage';
import { getCategories } from '../../../service/System.service';
import { statusLabels } from '../../../utils/Ticket.util';

export const SupportTicketsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALLE');

  const {
    data: tickets,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery(['tickets', selectedStatus], () => getByStatus(selectedStatus), {
    enabled: !!selectedStatus,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: categories = [] } = useQuery(['categories'], getCategories, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];

    const query = searchQuery.toLowerCase();
    return tickets.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
      const matchesCategory =
        selectedCategory === 'ALLE' ||
        (selectedCategory === 'Keine' && t.category === '') ||
        t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [tickets, searchQuery, selectedCategory]);

  if (isError) return <ServerErrorPage message="Fehler beim Laden der Anfragen" />;

  return (
    <div className="bg-zinc-900 min-h-screen p-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">Support-Anfragen</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as TicketStatus);
              refetch();
            }}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none"
          >
            {Object.entries(statusLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none"
          >
            <option value="ALLE">Alle Kategorien</option>
            <option value="Keine">Keine</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none"
          />
        </div>
      </div>

      {!selectedStatus ? (
        <p className="text-zinc-400 text-center mt-10 text-lg italic">
          Bitte wähle zuerst einen Status aus, um Tickets anzuzeigen.
        </p>
      ) : isLoading || isFetching ? (
        <div className="flex justify-center mt-20">
          <ClipLoader color="#22d3ee" size={50} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-zinc-700 rounded-xl overflow-hidden">
            <thead className="bg-zinc-800 text-zinc-300 text-sm uppercase">
              <tr>
                <th className="p-3 text-left">Titel</th>
                <th className="p-3 text-left">Beschreibung</th>
                <th className="p-3 text-left">Kategorie</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Supporter</th>
                <th className="p-3 text-left">Erstellt von</th>
              </tr>
            </thead>

            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-zinc-500 py-10">
                    Keine passenden Tickets gefunden.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <TicketRow key={ticket.id} ticket={ticket} />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
