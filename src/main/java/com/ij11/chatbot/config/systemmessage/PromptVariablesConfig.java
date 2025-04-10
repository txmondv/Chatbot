package com.ij11.chatbot.config.systemmessage;

import com.ij11.chatbot.core.annotations.DataConfigContent;
import com.ij11.chatbot.core.annotations.DefaultConfigFile;
import com.ij11.chatbot.core.annotations.JsonConfigFile;

import java.util.Map;

@JsonConfigFile(value = "system-message/variables.json", description = "JSON configuration for prompt variables")
@DefaultConfigFile("system-message/variables.json")
public class PromptVariablesConfig {

    @DataConfigContent
    public static Object PROMPT_VARIABLES;

    public static Map<String, Object> getPromptVariables() {
        return (Map<String, Object>) PROMPT_VARIABLES;
    }
}