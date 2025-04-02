package com.ij11.chatbot.core.aspects;

import com.ij11.chatbot.core.annotations.Roles;
import com.ij11.chatbot.core.exceptions.APIAccessDeniedException;
import com.ij11.chatbot.domain.models.users.User;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.users.UserInfoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;
import java.util.Optional;
import java.util.Set;

@Aspect
@Component
@RequiredArgsConstructor
public class RolesAspect {

    private final UserInfoService userInfoService;

    @Before("@annotation(roles)")
    public void checkRoles(JoinPoint joinPoint, Roles roles) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        Optional<User> userOpt = userInfoService.getUserByAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            throw new APIAccessDeniedException("You have to be logged in to access this resource.");
        }

        Set<UserRole> userRoles = userOpt.get().getRoles();

        for (UserRole requiredRole : roles.value()) {
            if (userRoles.contains(requiredRole)) {
                return;
            }
        }

        throw new APIAccessDeniedException("User does not have one of the allowed roles: " + Arrays.toString(roles.value()));
    }
}