package com.ij11.chatbot.api.controller.tickets;

import com.ij11.chatbot.api.dto.tickets.request.AssignSupporterRequest;
import com.ij11.chatbot.api.dto.tickets.request.UnassignSupporterRequest;
import com.ij11.chatbot.api.dto.tickets.request.UpdateTicketStatusRequest;
import com.ij11.chatbot.api.dto.tickets.response.TicketResponse;
import com.ij11.chatbot.api.dto.users.UserDto;
import com.ij11.chatbot.core.annotations.Authorized;
import com.ij11.chatbot.core.annotations.Roles;
import com.ij11.chatbot.domain.models.tickets.TicketStatus;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.tickets.ChatbotTicketService;
import com.ij11.chatbot.service.tickets.TicketNotFoundException;
import com.ij11.chatbot.service.users.UserInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/support")
@RequiredArgsConstructor
public class TicketSupportController {

    private final ChatbotTicketService chatbotTicketService;
    private final UserInfoService userInfoService;

    @Roles(UserRole.SUPPORT)
    @Authorized
    @GetMapping("/getByStatus/{status}")
    public ResponseEntity<List<TicketResponse>> getNotesForTicket(@PathVariable TicketStatus status) {
        List<TicketResponse> tickets = chatbotTicketService.getTicketsByStatus(status);
        return ResponseEntity.ok(tickets);
    }

    @Roles({UserRole.SUPPORT})
    @Authorized
    @PatchMapping("/setStatus")
    public ResponseEntity<TicketResponse> updateTicketStatus(@RequestBody UpdateTicketStatusRequest request, User user) {
        if(!chatbotTicketService.isTicketParticipant(user, request.getTicketId())) return ResponseEntity.status(403).build();
        try {
            TicketResponse response = chatbotTicketService.updateTicketStatus(request);
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Roles({UserRole.SUPPORT})
    @Authorized
    @PostMapping("/assign-supporter")
    public ResponseEntity<TicketResponse> assignSupporterToTicket(@RequestBody AssignSupporterRequest request) {
        try {
            TicketResponse response = chatbotTicketService.assignSupporterToTicket(request);
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Roles({UserRole.SUPPORT})
    @Authorized
    @PostMapping("/unassign-supporter")
    public ResponseEntity<TicketResponse> unassignSupporterFromTicket(@RequestBody UnassignSupporterRequest request) {
        try {
            TicketResponse response = chatbotTicketService.unassignSupporterFromTicket(request);
            return ResponseEntity.ok(response);
        } catch (TicketNotFoundException e) {
            return ResponseEntity.status(406).build();
        }
    }

    @Roles({UserRole.SUPPORT})
    @Authorized
    @GetMapping("/getAllSupporters")
    public ResponseEntity<List<UserDto>> getAllSupporters() {
        List<UserDto> supporters = userInfoService.getUsers().stream()
                .filter(user -> user.getRoles().contains(UserRole.SUPPORT))
                .toList();
        return ResponseEntity.ok(supporters);
    }
}
