package com.ij11.chatbot.api.controller.system;

import com.ij11.chatbot.core.annotations.Roles;
import com.ij11.chatbot.domain.models.system.StatName;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.system.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/system/stats")
public class StatsController {

    private final StatsService statsService;

    @Roles(UserRole.TECHNICAL)
    @GetMapping("/getAssistantRequests")
    public ResponseEntity<Long> getAssistantRequests() {
        return ResponseEntity.ok(statsService.getStatValue(StatName.ASSISTANT_REQUESTS));
    }

    @Roles(UserRole.TECHNICAL)
    @GetMapping("/getAverageResponseTime")
    public ResponseEntity<Double> getAverageResponseTime() {
        return ResponseEntity.ok(statsService.getAverageResponseTime());
    }
}
