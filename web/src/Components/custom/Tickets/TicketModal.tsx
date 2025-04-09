import { Modal } from '../../lib/modals/Modal';
import { TicketForm } from './TicketForm';

interface TicketModalProps {
  ticketId?: number;
  mode?: 'edit' | 'create';
  isOpen: boolean;
  onClose: () => void;
}

export const TicketModal = ({ ticketId, mode = 'edit', isOpen, onClose }: TicketModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-cyan-400">
        {mode === 'edit' ? 'Ticket bearbeiten' : 'Neues Ticket erstellen'}
      </h2>
      <TicketForm ticketId={ticketId} mode={mode} onClose={onClose} />
    </Modal>
  );
};
