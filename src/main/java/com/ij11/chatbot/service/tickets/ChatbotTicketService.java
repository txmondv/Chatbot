package com.ij11.chatbot.service.tickets;

import com.ij11.chatbot.api.dto.tickets.request.*;
import com.ij11.chatbot.api.dto.tickets.response.TicketMessageResponse;
import com.ij11.chatbot.api.dto.tickets.response.TicketNoteResponse;
import com.ij11.chatbot.api.dto.tickets.response.TicketResponse;
import com.ij11.chatbot.domain.models.chat.Chat;
import com.ij11.chatbot.domain.models.tickets.*;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.domain.repositories.ChatRepository;
import com.ij11.chatbot.domain.repositories.TicketMessageRepository;
import com.ij11.chatbot.domain.repositories.TicketNoteRepository;
import com.ij11.chatbot.service.users.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotTicketService {

    private final TicketService ticketService;
    private final ChatRepository chatRepository;
    private final TicketMessageRepository ticketMessageRepository;
    private final TicketNoteRepository ticketNoteRepository;
    private final UserInfoService userService;

    public boolean isTicketParticipant(User user, Long ticketId) {
        Ticket ticket = ticketService.getTicketById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));
        return user.hasRole(UserRole.SUPPORT) || ticket.getUser().equals(user);
    }

    public List<TicketResponse> getTicketsByStatus(TicketStatus status) {
        List<Ticket> tickets = ticketService.getTicketsByStatus(status);

        return tickets.stream()
                .map(this::getTicketResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicket(Long ticketId) {
        Ticket ticket = ticketService.getTicketById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        return getTicketResponse(ticket);
    }

    public List<TicketResponse> getTicketsByUser(User user) {
        List<Ticket> tickets = ticketService.getTicketsByUser(user);

        return tickets.stream()
                .map(this::getTicketResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketResponse createTicket(TicketCreationRequest request, User user) {
        Chat chat = null;
        if (request.getChatId() != null) {
            chat = chatRepository.findById(request.getChatId())
                    .orElseThrow(() -> new IllegalArgumentException("Chat not found"));
        }

        if(request.getCategory() == null) {
            // TODO: Kategorisierung durch KI
            request.setCategory("");
        }

        Ticket ticket = new Ticket();
        Long maxId = ticketService.findMaxId().orElse(0L);
        ticket.setId(maxId + 1);
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setCategory(request.getCategory());
        ticket.setUser(user);
        ticket.setChat(chat);
        ticket.setStatus(TicketStatus.OPEN);

        Ticket savedTicket = ticketService.createTicket(ticket);

        return getTicketResponse(savedTicket);
    }

    public List<TicketMessageResponse> getTicketMessages(Long ticketId) {
        Ticket ticket = ticketService.getTicketById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        return ticket.getMessages().stream()
                .map(message -> {
                    TicketMessageResponse response = new TicketMessageResponse();
                    response.setId(message.getId());
                    response.setSenderName(message.getSender().getUsername());
                    response.setSenderId(message.getSender().getId());
                    response.setSenderRole(message.getSenderRole());
                    response.setContent(message.getContent());
                    response.setTimestamp(message.getTimestamp());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public void sendMessageToTicket(User sender, SendTicketMessageRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        TicketMessageSenderRole role = ticket.getUser().equals(sender) ? TicketMessageSenderRole.USER : TicketMessageSenderRole.SUPPORT;
        TicketMessage message = new TicketMessage();
        message.setTicket(ticket);
        message.setSender(sender);
        message.setSenderRole(role);
        message.setContent(request.getContent());

        ticket.getMessages().add(message);
        ticketMessageRepository.save(message);
    }

    public TicketResponse updateTicketStatus(UpdateTicketStatusRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        ticket.setStatus(request.getNewStatus());
        Ticket updated = ticketService.updateTicket(ticket);

        return getTicketResponse(updated);
    }

    public TicketResponse assignSupporterToTicket(AssignSupporterRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        User supporter = userService.getUserById(request.getSupporterId())
                .orElseThrow(() -> new TicketNotFoundException("Supporter not found"));

        if (!supporter.hasRole(UserRole.SUPPORT)) {
            throw new TicketNotFoundException("User is not a supporter");
        }

        ticket.getAssignedSupporters().add(supporter);
        Ticket updated = ticketService.updateTicket(ticket);

        return getTicketResponse(updated);
    }

    public TicketResponse unassignSupporterFromTicket(UnassignSupporterRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        ticket.getAssignedSupporters().removeIf(supporter -> supporter.getId().equals(request.getSupporterId()));
        Ticket updated = ticketService.updateTicket(ticket);

        return getTicketResponse(updated);
    }

    public TicketResponse updateTicket(UpdateTicketRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException("Ticket not found"));

        if (request.getTitle() != null) ticket.setTitle(request.getTitle());
        if (request.getDescription() != null) ticket.setDescription(request.getDescription());
        if (request.getCategory() != null) ticket.setCategory(request.getCategory());
        if (request.getStatus() != null) ticket.setStatus(request.getStatus());
        Ticket updated = ticketService.updateTicket(ticket);

        return getTicketResponse(updated);
    }

    public void removeChatFromTickets(Long chatId) {
        List<Ticket> tickets = ticketService.getTicketsByChatId(chatId);
        for (Ticket ticket : tickets) {
            ticket.removeChat();
            ticketService.updateTicket(ticket);
        }
    }

    public List<Ticket> findByChatId(Long chatId) {
        return ticketService.getTicketsByChatId(chatId);
    }

    public List<TicketNoteResponse> getNotesForTicket(Long ticketId) {
        Ticket ticket = ticketService.getTicketById(ticketId)
                .orElseThrow(TicketNotFoundException::new);
        return ticketNoteRepository.findByTicketOrderByTimestampAsc(ticket).stream()
                .map(note -> {
                    TicketNoteResponse response = new TicketNoteResponse();
                    response.setId(note.getId());
                    response.setTicketId(note.getTicket().getId());
                    response.setAuthorName(note.getAuthor().getUsername());
                    response.setAuthorId(note.getAuthor().getId());
                    response.setContent(note.getContent());
                    response.setTimestamp(note.getTimestamp());
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void addNoteToTicket(User author, AddNoteRequest request) {
        Ticket ticket = ticketService.getTicketById(request.getTicketId())
                .orElseThrow(TicketNotFoundException::new);

        TicketNote note = new TicketNote();
        note.setId(ticketNoteRepository.findMaxId().orElse(0L) + 1);
        note.setTicket(ticket);
        note.setContent(request.getContent());
        note.setAuthor(author);

        ticketNoteRepository.save(note);
    }

    @Transactional
    public void removeNoteFromTicket(Long noteId) {
        if (!ticketNoteRepository.existsById(noteId)) {
            throw new IllegalArgumentException("Note not found");
        }
        ticketNoteRepository.deleteById(noteId);
    }


    /**
     * Converts a Ticket entity to a TicketResponse DTO.
     *
     * @param ticket The Ticket entity to convert.
     * @return The converted TicketResponse DTO.
     */
    private TicketResponse getTicketResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setCategory(ticket.getCategory());
        response.setUserId(ticket.getUser().getId());
        response.setUserName(ticket.getUser().getUsername());
        response.setChatId(ticket.getChat() != null ? ticket.getChat().getId() : null);
        response.setStatus(ticket.getStatus());
        response.setSupporterIds(
                ticket.getAssignedSupporters().stream()
                        .map(User::getId)
                        .collect(Collectors.toSet())
        );
        response.setSupporterNames(
                ticket.getAssignedSupporters().stream()
                        .map(User::getUsername)
                        .collect(Collectors.toSet())
        );
        return response;
    }

    @Transactional
    public void deleteTicket(Long ticketId) {
        ticketService.deleteTicket(ticketId);
    }
}
