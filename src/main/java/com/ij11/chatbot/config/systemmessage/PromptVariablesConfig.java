package com.ij11.chatbot.config.systemmessage;

import com.ij11.chatbot.core.annotations.DataConfigContent;
import com.ij11.chatbot.core.annotations.DefaultConfigFile;
import com.ij11.chatbot.core.annotations.JsonConfigFile;

@JsonConfigFile(value = "system-message/variables.json", description = "JSON configuration for prompt variables")
@DefaultConfigFile("system-message/variables.json")
public class PromptVariablesConfig {

    @DataConfigContent
    public static Object PROMPT_VARIABLES;
}