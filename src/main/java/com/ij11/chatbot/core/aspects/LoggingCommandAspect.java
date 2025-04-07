package com.ij11.chatbot.core.aspects;

import com.ij11.chatbot.core.annotations.LoggingCommand;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.shell.standard.ShellMethod;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.Arrays;

import static com.ij11.chatbot.core.commands.CommandManager.logCommandExecution;

@Aspect
@Component
public class LoggingCommandAspect {

    @Autowired
    private ApplicationContext applicationContext;

    @Before("@annotation(loggingCommand)")
    public void logCommand(JoinPoint joinPoint, LoggingCommand loggingCommand) {
        if (!(joinPoint.getSignature() instanceof MethodSignature signature)) return;
        Method method = signature.getMethod();
        if (method == null) return;

        logCommandExecution(method.getName());
    }
}