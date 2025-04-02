package com.ij11.chatbot.api.dto.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OllamaModel {
    private String name;
    private String model;
    @JsonProperty("modified_at")
    private String modifiedAt;
    private long size;
    private String digest;
    private OllamaModelDetails details;

    @Override
    public String toString() {
        return "OllamaModel{" +
                "name='" + name + '\'' +
                ", model='" + model + '\'' +
                ", modifiedAt='" + modifiedAt + '\'' +
                ", size=" + size +
                ", digest='" + digest + '\'' +
                ", details=" + details +
                '}';
    }
}