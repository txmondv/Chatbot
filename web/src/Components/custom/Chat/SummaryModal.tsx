import React, { useEffect, useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router';
import { ScaleLoader } from 'react-spinners';
import { getSummary } from '../../../service/Chat.service';
import { createTicket } from '../../../service/Ticket.service';
import { TicketResponse } from '../../../types/Ticket.types';
import { Modal } from '../../lib/modals/Modal';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  const { chatId } = useParams<{ chatId: string }>();

  const { data: fetchedSummary, isLoading, isError } = useQuery(
    ['summary', chatId],
    () => getSummary(Number(chatId)),
    { enabled: isOpen }
  );

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null);

  const {
    mutate: createTicketMutation,
    isLoading: isCreating,
    isError: createError,
  } = useMutation(createTicket, {
    onSuccess: (ticket) => {
      console.log(ticket);
      setCreatedTicket(ticket);
    },
  });

  useEffect(() => {
    if (fetchedSummary) {
      setCategory(fetchedSummary.category);
      setTitle(fetchedSummary.title);
      setSummary(fetchedSummary.summary);
    }
  }, [fetchedSummary]);

  const handleCreate = () => {
    if (!chatId || isCreating) return;

    createTicketMutation({
      title,
      description: summary,
      category,
      chatId: Number(chatId),
    });
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex justify-center items-center h-40">
          <ScaleLoader color="#22d3ee" />
        </div>
      </Modal>
    );
  }

  if (isError || !fetchedSummary) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="text-red-400">Fehler beim Laden der Zusammenfassung.</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6 max-h-[80vh] overflow-y-auto p-1">
        {!createdTicket ? (
          <>
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              Ticket erstellen
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-1">Kategorie</label>
                <input
                  type="text"
                  value={category}
                  disabled
                  className="w-full bg-zinc-800 text-white rounded px-3 py-2 border border-zinc-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-1">Titel</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-800 text-white rounded px-3 py-2 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-cyan-400 text-sm font-semibold mb-1">Zusammenfassung</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={5}
                  className="w-full bg-zinc-800 text-white rounded px-3 py-2 border border-zinc-700 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FiAlertCircle className="text-yellow-400" />
              Durch das Erstellen des Tickets wird dein Chat mit Mitarbeitenden geteilt.
            </div>

            {createError && (
              <div className="text-red-500 text-sm">
                Fehler beim Erstellen des Tickets. Bitte versuche es erneut.
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={onClose}
                disabled={isCreating}
                className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600 transition disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition disabled:opacity-50"
              >
                {isCreating ? 'Erstellen...' : 'Erstellen'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center text-center space-y-4">
              <FiCheckCircle className="text-green-400 text-6xl" />
              <h2 className="text-2xl font-bold text-green-400">Ticket erfolgreich erstellt!</h2>
            </div>

            <div className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 shadow mt-4">
              <h3 className="text-xl font-semibold text-white">{createdTicket.title}</h3>
              <p className="text-gray-300 text-sm">{createdTicket.description}</p>

              <div className="flex flex-wrap gap-2 mt-3 text-sm text-zinc-400">
                <span className="bg-zinc-700 px-2 py-1 rounded-full">Kategorie: {createdTicket.category}</span>
                <span className="bg-zinc-700 px-2 py-1 rounded-full">Status: {createdTicket.status}</span>
                <span className="bg-zinc-700 px-2 py-1 rounded-full">Ticket-ID: #{createdTicket.id}</span>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 transition"
              >
                Schließen
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default SummaryModal;
