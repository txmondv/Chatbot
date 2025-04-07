package com.ij11.chatbot.core.commands;

import org.slf4j.LoggerFactory;

public class CommandManager {
    public static void logCommandResult(String result) {
        logCommandResult("", result);
    }

    public static void logCommandResult(String command, String result) {
        LoggerFactory.getLogger("cmd/" + command).info(result);
    }

    public static void logCommandExecution(String command) {
        LoggerFactory.getLogger("cmd").info("Console executed command {}", command);
    }
}
