package com.ij11.chatbot.dto.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OllamaResponse {
    @JsonProperty("models")
    private List<OllamaModel> models;

    @Override
    public String toString() {
        return "OllamaResponse{" + "models=" + models + '}';
    }
}
