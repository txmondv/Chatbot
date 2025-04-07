package com.ij11.chatbot.api.dto.ollama;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OllamaModel {
    private String name;

    @JsonProperty("modified_at")
    private String modifiedAt;

    private long size;
    private String digest;

    private String modelfile;
    private String parameters;
    private String template;

    private OllamaModelDetails details;
    @JsonProperty("model_info")
    private Map<String, Object> modelInfo;
    private List<String> capabilities;

    /**
     * Does not include modelfile, parameters or template.
     *
     * @return readable model info
     */
    @Override
    public String toString() {
        return "OllamaModel{" +
                "name='" + name + '\'' +
                ", modifiedAt='" + modifiedAt + '\'' +
                ", size=" + size +
                ", digest='" + digest + '\'' +
                ", details=" + details +
                ", modelInfo=" + modelInfo +
                ", capabilities=" + capabilities +
                '}';
    }
}
