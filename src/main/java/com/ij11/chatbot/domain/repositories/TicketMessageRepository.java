package com.ij11.chatbot.domain.repositories;

import com.ij11.chatbot.domain.models.tickets.Ticket;
import com.ij11.chatbot.domain.models.tickets.TicketMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketMessageRepository extends JpaRepository<TicketMessage, Long> {
    List<TicketMessage> findByTicketOrderByTimestampAsc(Ticket ticket);
}
