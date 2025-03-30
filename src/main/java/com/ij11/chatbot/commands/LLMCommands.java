package com.ij11.chatbot.commands;

import com.ij11.chatbot.config.commands.CommandManager;
import com.ij11.chatbot.config.ChatbotUserConfig;
import com.ij11.chatbot.dto.ollama.OllamaModel;
import com.ij11.chatbot.service.chat.OllamaInfoService;
import lombok.AllArgsConstructor;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;

import java.util.Optional;

@AllArgsConstructor
@ShellComponent
public class LLMCommands {
    private final OllamaInfoService ollamaInfoService = new OllamaInfoService();

    @ShellMethod("Checks if Ollama is running")
    public void ollamaCheck() {
        String ollamaLocation = ChatbotUserConfig.getOllamaAddress() + ":" + ChatbotUserConfig.getOllamaPort();
        if (ollamaInfoService.isOllamaRunning()) CommandManager.logCommandResult("LLM", "Ollama is running at " + ollamaLocation);
        else CommandManager.logCommandResult("LLM", "Ollama is not reachable at " + ollamaLocation);
    }

    @ShellMethod("Prints the version of the running Ollama instance")
    public void ollamaVersion() {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        CommandManager.logCommandResult("LLM", ollamaInfoService.getOllamaVersion());
    }

    @ShellMethod("Prints all loaded Ollama models")
    public void ollamaModels() {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        CommandManager.logCommandResult("LLM", ollamaInfoService.getModelNames().toString());
    }

    @ShellMethod("Prints tags of a specific Ollama model")
    public void ollamaModelTags(String modelName) {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        Optional<OllamaModel> model = ollamaInfoService.getModelTags(modelName);

        if (model.isPresent()) {
            CommandManager.logCommandResult("LLM", model.get().toString());
        } else {
            CommandManager.logCommandResult("LLM", "Model not found: " + modelName);
        }
    }
}
