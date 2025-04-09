package com.ij11.chatbot.config.systemmessage;

import com.ij11.chatbot.core.annotations.DataConfigContent;
import com.ij11.chatbot.core.annotations.DefaultConfigFile;
import com.ij11.chatbot.core.annotations.TextConfigFile;

import java.util.Map;

@TextConfigFile(value = "system-message/message.txt", description = "Text configuration for system prompt")
@DefaultConfigFile("system-message/message.txt")
public class SystemMessageConfig {

    @DataConfigContent
    public static String MESSAGE;

    public static String getMessage() {
        return applyPromptVariables(MESSAGE);
    }

    private static String applyPromptVariables(String input) {
        if (PromptVariablesConfig.PROMPT_VARIABLES instanceof Map) {
            Map<String, Object> variables = (Map<String, Object>) PromptVariablesConfig.PROMPT_VARIABLES;
            for (Map.Entry<String, Object> entry : variables.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue().toString();
                input = input.replace("${" + key + "}", value);
            }
        }
        return input;
    }
}