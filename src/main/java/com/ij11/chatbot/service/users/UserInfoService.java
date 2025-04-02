package com.ij11.chatbot.service.users;

import com.ij11.chatbot.core.security.jwt.JwtUtil;
import com.ij11.chatbot.api.dto.users.UserDto;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserInfoService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public Optional<User> getUserByAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return Optional.empty();

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) return Optional.empty();

        String username = jwtUtil.extractUsername(token);
        return userRepository.findByUsername(username);
    }

    public Optional<User> getUserByName(String userName) {
        return userRepository.findByUsernameIgnoreCase(userName);
    }

    public List<UserDto> getUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDto(user.getId(), user.getUsername(), user.getRoles()))
                .collect(Collectors.toList());
    }
}
