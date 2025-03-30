package com.ij11.chatbot.controller.users;

import com.ij11.chatbot.config.security.jwt.JwtUtil;
import com.ij11.chatbot.service.users.UserInfoService;
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
    private final UserInfoService userInfoService;

    @GetMapping("/getUsername")
    public ResponseEntity<String> getUsername(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        String username = userInfoService.getUsername(authHeader);
        return ResponseEntity.of(username != null ? Optional.of(username) : Optional.empty());
    }
}
