import { TicketStatus } from "../types/Ticket.types";

export const statusLabels: Record<TicketStatus, string> = {
  OPEN: "Offen",
  IN_PROGRESS: "In Bearbeitung",
  CLOSED: "Geschlossen",
  DISCARDED: "Verworfen",
  RESOLVED: "Gelöst"
};