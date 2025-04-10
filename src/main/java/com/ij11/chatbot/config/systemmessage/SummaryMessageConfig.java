package com.ij11.chatbot.config.systemmessage;

import com.ij11.chatbot.core.annotations.DataConfigContent;
import com.ij11.chatbot.core.annotations.DefaultConfigFile;
import com.ij11.chatbot.core.annotations.TextConfigFile;

import java.util.Map;

import static com.ij11.chatbot.config.systemmessage.PromptVariablesConfig.getPromptVariables;

@TextConfigFile(value = "system-message/summary.txt", description = "Text configuration for system prompt")
@DefaultConfigFile("system-message/summary.txt")
public class SummaryMessageConfig {

    @DataConfigContent
    public static String MESSAGE;

    public static String getMessage() {
        return applyPromptVariables(MESSAGE);
    }

    private static String applyPromptVariables(String input) {
        if (PromptVariablesConfig.PROMPT_VARIABLES instanceof Map) {
            for (Map.Entry<String, Object> entry : getPromptVariables().entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue().toString();
                input = input.replace("${" + key + "}", value);
            }
        }
        return input;
    }
}