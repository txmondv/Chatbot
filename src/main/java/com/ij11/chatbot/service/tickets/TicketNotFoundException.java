package com.ij11.chatbot.service.tickets;

public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException() {
        this("Ticket not found.");
    }

    public TicketNotFoundException(String message) {
        super(message);
    }
}
