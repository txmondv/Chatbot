// File: src/components/TicketHeader.tsx
import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface TicketHeaderProps {
  title: string;
  category: string;
  supporters: string[];
  onEdit: () => void;
  onDelete: () => void;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ title, category, supporters, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start p-4 border-b border-zinc-700">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-zinc-400 mt-1 flex items-center space-x-2">
          <span>Kategorie: {category}</span>
          <span>|</span>
          <span>
            {supporters.length > 0 ? `Zugewiesen: ${supporters.join(', ')}` : "Noch niemand zugewiesen :("}
          </span>
        </div>
      </div>
      <div className="mt-2 md:mt-0 flex gap-2">
        <button
          onClick={onEdit}
          className="flex items-center gap-1 bg-cyan-400 text-zinc-900 px-3 py-1 rounded hover:bg-cyan-300 transition"
        >
          <FiEdit /> Bearbeiten
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 transition"
        >
          <FiTrash2 /> Löschen
        </button>
      </div>
    </div>
  );
};

export default TicketHeader;
