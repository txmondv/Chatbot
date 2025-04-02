package com.ij11.chatbot.api.dto.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
class OllamaModelDetails {
    @JsonProperty("parent_model")
    private String parentModel;
    private String format;
    private String family;
    private List<String> families;
    @JsonProperty("parameter_size")
    private String parameterSize;
    @JsonProperty("quantization_level")
    private String quantizationLevel;

    @Override
    public String toString() {
        return "OllamaModelDetails{" +
                "parentModel='" + parentModel + '\'' +
                ", format='" + format + '\'' +
                ", family='" + family + '\'' +
                ", families=" + families +
                ", parameterSize='" + parameterSize + '\'' +
                ", quantizationLevel='" + quantizationLevel + '\'' +
                '}';
    }
}
