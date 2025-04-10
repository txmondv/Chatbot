package com.ij11.chatbot.api.controller.tickets;

import com.ij11.chatbot.api.dto.tickets.request.AddNoteRequest;
import com.ij11.chatbot.api.dto.tickets.response.TicketNoteResponse;
import com.ij11.chatbot.core.annotations.Authorized;
import com.ij11.chatbot.core.annotations.Roles;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.tickets.ChatbotTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/notes")
@RequiredArgsConstructor
public class TicketNoteController {

    private final ChatbotTicketService chatbotTicketService;

    @Roles(UserRole.SUPPORT)
    @Authorized
    @GetMapping("/{ticketId}")
    public ResponseEntity<List<TicketNoteResponse>> getNotesForTicket(@PathVariable Long ticketId) {
        List<TicketNoteResponse> notes = chatbotTicketService.getNotesForTicket(ticketId);
        return ResponseEntity.ok(notes);
    }

    @Roles(UserRole.SUPPORT)
    @Authorized
    @PostMapping("/add")
    public ResponseEntity<Void> addNoteToTicket(
            User user,
            @RequestBody AddNoteRequest request) {
        chatbotTicketService.addNoteToTicket(user, request);
        return ResponseEntity.ok().build();
    }

    @Roles(UserRole.SUPPORT)
    @Authorized
    @DeleteMapping("/delete/{noteId}")
    public ResponseEntity<Void> removeNoteFromTicket(@PathVariable Long noteId) {
        chatbotTicketService.removeNoteFromTicket(noteId);
        return ResponseEntity.ok().build();
    }
}
