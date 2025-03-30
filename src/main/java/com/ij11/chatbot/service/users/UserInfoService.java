package com.ij11.chatbot.service.users;

import com.ij11.chatbot.config.security.jwt.JwtUtil;
import com.ij11.chatbot.models.User;
import com.ij11.chatbot.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class UserInfoService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public Optional<User> getUserByAuthHeader(String authHeader) {
        return userRepository.findByUsername(getUsername(authHeader));
    }

    public Optional<User> getUserByName(String userName) {
        return userRepository.findByUsername(userName);
    }

    public String getUsername(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return "Missing/incorrect authentication header.";
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return "Invalid authentication token.";
        }

        return jwtUtil.extractUsername(token);
    }
}
