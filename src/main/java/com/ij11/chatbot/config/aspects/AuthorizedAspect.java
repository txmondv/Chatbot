package com.ij11.chatbot.config.aspects;

import com.ij11.chatbot.config.annotations.Authorized;
import com.ij11.chatbot.models.users.User;
import com.ij11.chatbot.service.users.UserInfoService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.nio.file.AccessDeniedException;
import java.util.Optional;

@Aspect
@Component
@RequiredArgsConstructor
public class AuthorizedAspect {

    private final UserInfoService userInfoService;

    @Around("@annotation(authorized)")
    public Object checkAuthorization(ProceedingJoinPoint joinPoint, Authorized authorized) throws Throwable {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);

        Optional<User> userOpt = userInfoService.getUserByAuthHeader(authHeader);
        if (userOpt.isEmpty()) {
            throw new AccessDeniedException("You have to be logged in to access this resource.");
        }

        User user = userOpt.get();
        Object[] args = joinPoint.getArgs();
        for (int i = 0; i < args.length; i++) {
            if (args[i] instanceof User) {
                args[i] = user;
                break;
            }
        }

        return joinPoint.proceed(args);
    }
}