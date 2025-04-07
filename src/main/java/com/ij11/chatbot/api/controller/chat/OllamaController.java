package com.ij11.chatbot.api.controller.chat;

import com.ij11.chatbot.api.dto.ollama.OllamaModel;
import com.ij11.chatbot.core.annotations.Authorized;
import com.ij11.chatbot.core.annotations.Roles;
import com.ij11.chatbot.domain.models.users.UserRole;
import com.ij11.chatbot.service.chat.OllamaInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

    @Authorized
    @Roles(UserRole.TECHNICAL)
    @GetMapping("/modelInfo/{modelName}")
    public ResponseEntity<OllamaModel> getModelInfo(@PathVariable String modelName) {
        return ResponseEntity.of(ollamaInfoService.getModelInfo(modelName));
    }
}
