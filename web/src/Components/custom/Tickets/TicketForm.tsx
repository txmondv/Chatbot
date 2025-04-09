import { useState, useEffect } from 'react';
import { useCreateTicket, useUpdateTicket } from '../../../hooks/Ticket.hooks';
import { getTicket } from '../../../service/Ticket.service';


export const TicketForm = ({
  ticketId,
  mode,
  onClose,
}: {
  ticketId?: number;
  mode: 'edit' | 'create';
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
  });

  const { mutate: createTicket } = useCreateTicket(onClose);
  const { mutate: updateTicket } = useUpdateTicket(onClose);

  useEffect(() => {
    if (mode === 'edit' && ticketId) {
      getTicket(ticketId).then((ticket) =>
        setForm({
          title: ticket.title,
          description: ticket.description,
          category: ticket.category,
        })
      );
    }
  }, [ticketId, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'create') {
      createTicket({
        title: form.title,
        description: form.description
      });
    } else if (ticketId) {
      updateTicket({
        ticketId,
        ...form,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full bg-zinc-700 p-2 rounded text-white"
        placeholder="Titel"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="w-full bg-zinc-700 p-2 rounded text-white"
        placeholder="Beschreibung"
        rows={4}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <input
        className="w-full bg-zinc-700 p-2 rounded text-white cursor-not-allowed"
        placeholder="Kategorie"
        value={form.category}
        disabled
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-zinc-600 rounded hover:bg-zinc-500"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-400 text-zinc-900 font-bold rounded hover:bg-cyan-300"
        >
          {mode === 'create' ? 'Erstellen' : 'Speichern'}
        </button>
      </div>
    </form>
  );
};
