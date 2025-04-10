package com.ij11.chatbot.service.tickets;

import com.ij11.chatbot.domain.models.tickets.Ticket;
import com.ij11.chatbot.domain.models.tickets.TicketStatus;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Optional<Long> findMaxId() {
        return ticketRepository.findMaxId();
    }

    @Transactional
    public Ticket createTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    public List<Ticket> getTicketsByUser(User user) {
        return ticketRepository.findByUser(user);
    }

    public List<Ticket> getTicketsByChatId(Long chatId) {
        return ticketRepository.findByChatId(chatId);
    }

    public Ticket updateTicket(Ticket ticket) {
        if (ticketRepository.existsById(ticket.getId())) {
            return ticketRepository.save(ticket);
        } else {
            throw new IllegalArgumentException("Ticket not found");
        }
    }

    public void deleteTicket(Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("Ticket not found");
        }
    }
}