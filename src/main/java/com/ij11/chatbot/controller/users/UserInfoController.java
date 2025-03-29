package com.ij11.chatbot.controller.users;

import com.ij11.chatbot.config.security.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users/info")
public class UserInfoController {
    private final JwtUtil jwtUtil;

    @GetMapping("/getUsername")
    public ResponseEntity<String> getUsername(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.of(Optional.of("Missing/incorrect authentication header."));
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.of(Optional.of("Invalid authentication token."));
        }

        String username = jwtUtil.extractUsername(token);
        return ResponseEntity.of(username != null ? Optional.of(username) : Optional.empty());
    }
}
