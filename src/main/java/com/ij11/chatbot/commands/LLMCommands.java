package com.ij11.chatbot.commands;

import com.ij11.chatbot.api.dto.ollama.OllamaModel;
import com.ij11.chatbot.core.annotations.LoggingCommand;
import com.ij11.chatbot.core.commands.CommandManager;
import com.ij11.chatbot.service.chat.OllamaInfoService;
import lombok.AllArgsConstructor;
import org.springframework.shell.standard.ShellComponent;
import org.springframework.shell.standard.ShellMethod;

import java.util.Optional;

import static com.ij11.chatbot.config.OllamaUserConfig.OLLAMA_ADDRESS;
import static com.ij11.chatbot.config.OllamaUserConfig.OLLAMA_PORT;

@AllArgsConstructor
@ShellComponent
public class LLMCommands {
    private final OllamaInfoService ollamaInfoService = new OllamaInfoService();

    @LoggingCommand
    @ShellMethod("Checks if Ollama is running")
    public void ollamaCheck() {
        String ollamaLocation = OLLAMA_ADDRESS.get() + ":" + OLLAMA_PORT.get();
        if (ollamaInfoService.isOllamaRunning()) CommandManager.logCommandResult("LLM", "Ollama is running at " + ollamaLocation);
        else CommandManager.logCommandResult("LLM", "Ollama is not reachable at " + ollamaLocation);
    }

    @LoggingCommand
    @ShellMethod("Prints the version of the running Ollama instance")
    public void ollamaVersion() {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        CommandManager.logCommandResult("LLM", ollamaInfoService.getOllamaVersion());
    }

    @LoggingCommand
    @ShellMethod("Prints all loaded Ollama models")
    public void ollamaModels() {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        CommandManager.logCommandResult("LLM", ollamaInfoService.getModelNames().toString());
    }

    @LoggingCommand
    @ShellMethod("Prints tags of a specific Ollama model")
    public void ollamaModelTags(String modelName) {
        if (!ollamaInfoService.isOllamaRunning()) {
            CommandManager.logCommandResult("LLM", "Ollama is not reachable");
            return;
        }

        Optional<OllamaModel> model = ollamaInfoService.getModelInfo(modelName);

        if (model.isPresent()) {
            CommandManager.logCommandResult("LLM", model.get().toString());
        } else {
            CommandManager.logCommandResult("LLM", "Model not found: " + modelName);
        }
    }
}
