import { useState } from "react";
import { Modal } from "../../../lib/modals/Modal";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (content: string) => void;
}

export const AddNoteModal = ({ isOpen, onClose, onAdd }: AddNoteModalProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAdd(content);
    setContent("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Notiz hinzufügen</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full bg-zinc-700 p-2 rounded text-white"
          placeholder="Notiz eingeben..."
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            Hinzufügen
          </button>
        </div>
      </form>
    </Modal>
  );
};
