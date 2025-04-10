package com.ij11.chatbot.api.controller.system;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

import static com.ij11.chatbot.config.systemmessage.PromptVariablesConfig.getPromptVariables;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/system/settings")
public class SettingInfoController {

    @GetMapping("/getCategories")
    public ResponseEntity<List<String>> getCategories() {
        Map<String, Object> promptVariables = getPromptVariables();
        if(promptVariables.containsKey("categories")) {
            List<String> categories = (List<String>) promptVariables.get("categories");
            return ResponseEntity.ok(categories);
        }
        return ResponseEntity.notFound().build();
    }
}
