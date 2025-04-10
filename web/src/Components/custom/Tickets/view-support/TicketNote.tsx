import { FiTrash2 } from "react-icons/fi";
import { TicketNote } from "../../../../types/Ticket.types";
import { formatDate } from "../../../../utils/Formatting.utils";

interface TicketNoteProps {
  note: TicketNote;
  onDelete: (id: number) => void;
}

const TicketNoteComponent = ({ note, onDelete }: TicketNoteProps) => {
  return (
    <div className="bg-zinc-700 p-4 rounded-lg mb-3 shadow-md flex justify-between items-start gap-4">
      <div>
        <p className="text-sm text-zinc-300 mb-1">
          {note.authorName ?? "Unbekannt"}, {formatDate(note.timestamp)}
        </p>
        <p className="text-white">{note.content}</p>
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className="text-red-400 hover:text-red-300"
        title="Löschen"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
};

export default TicketNoteComponent;
