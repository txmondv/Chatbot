package com.ij11.chatbot.domain.repositories;

import com.ij11.chatbot.domain.models.tickets.Ticket;
import com.ij11.chatbot.domain.models.tickets.TicketStatus;
import com.ij11.chatbot.domain.models.users.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUser(User user);
    List<Ticket> findByChatId(Long chatId);
    List<Ticket> findByStatus(TicketStatus status);

    @Query("SELECT MAX(t.id) FROM Ticket t")
    Optional<Long> findMaxId();
}
