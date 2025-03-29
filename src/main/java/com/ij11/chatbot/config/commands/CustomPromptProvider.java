package com.ij11.chatbot.config.commands;

import org.springframework.shell.jline.PromptProvider;
import org.jline.utils.AttributedString;
import org.springframework.stereotype.Component;

@Component
public class CustomPromptProvider implements PromptProvider {
    @Override
    public AttributedString getPrompt() {
        return new AttributedString("");
    }
}