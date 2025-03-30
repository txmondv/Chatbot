package com.ij11.chatbot.controller.auth;

import com.ij11.chatbot.config.security.jwt.JwtUtil;
import com.ij11.chatbot.dto.auth.AuthRequest;
import com.ij11.chatbot.dto.auth.AuthResponse;
import com.ij11.chatbot.dto.auth.RegisterRequest;
import com.ij11.chatbot.dto.auth.RegisterResponse;
import com.ij11.chatbot.models.User;
import com.ij11.chatbot.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        Optional<User> user = authService.registerUser(request.getUsername(), request.getPassword());
        return user
                .map(value -> new RegisterResponse(true, "User " + value.getUsername() + " erfolgreich registriert."))
                .orElseGet(() -> new RegisterResponse(false, "User ist bereits registriert!"));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return new AuthResponse("Unbekannter Benutzername oder Passwort.");
        }

        String accessToken = jwtUtil.generateToken(request.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(request.getUsername());

        response.addHeader(HttpHeaders.SET_COOKIE, authService.getRefreshCookie(refreshToken, jwtUtil.getRefreshTokenExpiry()).toString());

        return new AuthResponse(true, accessToken);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(HttpServletRequest request) {
        String refreshToken = jwtUtil.extractTokenFromCookie(request, "refresh_token");

        if (refreshToken == null || !jwtUtil.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid or expired refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        String newAccessToken = jwtUtil.generateRefreshToken(username);

        return new AuthResponse(true, newAccessToken);
    }

    @GetMapping("/isAuthenticated")
    public ResponseEntity<Boolean> isAuthenticated(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false);
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.ok(false);
        }

        return ResponseEntity.ok(true);
    }
}
