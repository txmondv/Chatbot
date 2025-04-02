package com.ij11.chatbot.api.controller.system;

import com.ij11.chatbot.api.dto.system.HardwareStats;
import com.ij11.chatbot.service.system.ResourceInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/system/resources")
public class ResourceInfoController {

    private final ResourceInfoService resourceInfoService;

    @GetMapping("/getHardwareStats")
    public ResponseEntity<HardwareStats> getHardwareStats(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader) {
        return ResponseEntity.of(resourceInfoService.getHardwareStats());
    }
}
