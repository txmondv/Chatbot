package com.ij11.chatbot.commands.containers;

import com.ij11.chatbot.commands.CommandManager;
import com.ij11.chatbot.config.WebServerConfig;
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
        String ollamaLocation = WebServerConfig.getOllamaAddress() + ":" + WebServerConfig.getOllamaPort();
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

        CommandManager.logCommandResult("LLM", ollamaInfoService.getModelNames());
    }

    @ShellMethod("Prints details of a specific Ollama model")
    public void ollamaModel(String modelName) {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        Optional<OllamaModel> model = ollamaInfoService.getModel(modelName);

        if (model.isPresent()) {
            CommandManager.logCommandResult("LLM", model.get().toString());
        } else {
            CommandManager.logCommandResult("LLM", "Model not found: " + modelName);
        }
    }
}
