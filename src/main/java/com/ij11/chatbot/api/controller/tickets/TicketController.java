package com.ij11.chatbot.api.controller.tickets;

import com.ij11.chatbot.api.dto.tickets.request.SendTicketMessageRequest;
import com.ij11.chatbot.api.dto.tickets.request.TicketCreationRequest;
import com.ij11.chatbot.api.dto.tickets.request.UpdateTicketRequest;
import com.ij11.chatbot.api.dto.tickets.response.TicketMessageResponse;
import com.ij11.chatbot.api.dto.tickets.response.TicketResponse;
import com.ij11.chatbot.core.annotations.Authorized;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.service.tickets.ChatbotTicketService;
import com.ij11.chatbot.service.tickets.TicketNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final ChatbotTicketService chatbotTicketService;

    @Authorized
    @GetMapping("/{id}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable Long id, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, id)) return ResponseEntity.status(403).build();
        try {
            TicketResponse response = chatbotTicketService.getTicket(id);
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Authorized
    @GetMapping("/{id}/messages")
    public ResponseEntity<List<TicketMessageResponse>> getTicketMessages(@PathVariable Long id, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, id)) return ResponseEntity.status(403).build();
        try {
            List<TicketMessageResponse> messages = chatbotTicketService.getTicketMessages(id);
            return ResponseEntity.ok(messages);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Authorized
    @GetMapping
    public ResponseEntity<List<TicketResponse>> getTicketsByUser(User user) {
        List<TicketResponse> response = chatbotTicketService.getTicketsByUser(user);
        return ResponseEntity.ok(response);
    }

    @Authorized
    @PostMapping("/create")
    public ResponseEntity<TicketResponse> createTicket(@RequestBody TicketCreationRequest request, User user) {
        TicketResponse response = chatbotTicketService.createTicket(request, user);
        return ResponseEntity.ok(response);
    }

    @Authorized
    @PostMapping("/message")
    public ResponseEntity<Void> sendMessageToTicket(@RequestBody SendTicketMessageRequest request, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, request.getTicketId())) return ResponseEntity.status(403).build();
        try {
            chatbotTicketService.sendMessageToTicket(user, request);
            return ResponseEntity.ok().build();
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Authorized
    @PatchMapping("/update")
    public ResponseEntity<TicketResponse> updateTicket(@RequestBody UpdateTicketRequest request, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, request.getTicketId())) return ResponseEntity.status(403).build();
        try {
            TicketResponse response = chatbotTicketService.updateTicket(request);
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Authorized
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, id)) return ResponseEntity.status(403).build();
        try {
            chatbotTicketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }
}