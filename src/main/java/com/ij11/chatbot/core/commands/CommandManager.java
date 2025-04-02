package com.ij11.chatbot.core.commands;

import org.slf4j.LoggerFactory;

public class CommandManager {
    public static void logCommandResult(String result) {
        logCommandResult("", result);
    }

    public static void logCommandResult(String command, String result) {
        LoggerFactory.getLogger("cmd/" + command).info(result);
    }
}
