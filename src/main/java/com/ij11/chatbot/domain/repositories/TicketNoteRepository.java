package com.ij11.chatbot.domain.repositories;

import com.ij11.chatbot.domain.models.tickets.Ticket;
import com.ij11.chatbot.domain.models.tickets.TicketNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TicketNoteRepository extends JpaRepository<TicketNote, Long> {
    List<TicketNote> findByTicketOrderByTimestampAsc(Ticket ticket);

    @Query("SELECT MAX(n.id) FROM TicketNote n")
    Optional<Long> findMaxId();
}
