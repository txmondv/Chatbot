package com.ij11.chatbot.api.controller.chat;

import com.ij11.chatbot.service.chat.OllamaInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/ollama")
@RequiredArgsConstructor
public class OllamaController {

    private final OllamaInfoService ollamaInfoService;

    @GetMapping("/getModels")
    public List<String> getModelNames() {
        return ollamaInfoService.getModelNames();
    }
}
