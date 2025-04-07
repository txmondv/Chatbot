package com.ij11.chatbot.service.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ij11.chatbot.api.dto.ollama.OllamaModel;
import com.ij11.chatbot.api.dto.ollama.OllamaResponse;
import com.ij11.chatbot.config.OllamaUserConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OllamaInfoService {
    private final static String OLLAMA_ADDRESS = OllamaUserConfig.OLLAMA_ADDRESS.get() + ":" + OllamaUserConfig.OLLAMA_PORT.get();

    private static HttpURLConnection getHttpURLConnection(String endpoint) throws IOException {
        URL url = new URL(OLLAMA_ADDRESS + endpoint);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("GET");
        connection.setRequestProperty("Accept", "application/json");
        return connection;
    }

    private static String fetch(String endpoint, String method, String requestBody) {
        try {
            URL url = new URL(OLLAMA_ADDRESS + endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod(method);
            connection.setRequestProperty("Accept", "application/json");

            if ("POST".equalsIgnoreCase(method)) {
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setDoOutput(true);
                if (requestBody != null) {
                    connection.getOutputStream().write(requestBody.getBytes());
                }
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            StringBuilder response = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                response.append(output);
            }
            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Ollama API response from " + endpoint, e);
        }
    }

    private static String fetch(String endpoint) {
        return fetch(endpoint, "GET", null);
    }


    public String getOllamaVersion() {
        try {
            return new ObjectMapper().readTree(fetch("/api/version")).get("version").asText();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Ollama API response", e);
        }
    }

    public boolean isOllamaRunning() {
        try {
            URL url = new URL(OLLAMA_ADDRESS + "/api/tags");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            int responseCode = connection.getResponseCode();
            connection.disconnect();
            return responseCode == HttpURLConnection.HTTP_OK;
        } catch (Exception e) {
            return false;
        }
    }

    public OllamaResponse fetchOllamaTags() {
        try {
            return  new ObjectMapper().readValue(fetch("/api/tags"), OllamaResponse.class);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching Ollama API response", e);
        }
    }

    public List<String> getModelNames() {
        return fetchOllamaTags().getModels().stream()
                .map(OllamaModel::getName)
                .collect(Collectors.toList());
    }

    public Optional<OllamaModel> getModelInfo(String modelName) {
        try {
            Optional<OllamaModel> tagModelOpt = fetchOllamaTags().getModels().stream()
                    .filter(m -> m.getName().equalsIgnoreCase(modelName))
                    .findFirst();

            if (tagModelOpt.isEmpty()) return Optional.empty();
            OllamaModel tagModel = tagModelOpt.get();

            String requestJson = "{\"model\":\"" + modelName + "\"}";
            String response = fetch("/api/show", "POST", requestJson);

            OllamaModel detailedModel = new ObjectMapper().readValue(response, OllamaModel.class);
            detailedModel.setName(tagModel.getName());
            detailedModel.setModifiedAt(tagModel.getModifiedAt());
            detailedModel.setSize(tagModel.getSize());
            detailedModel.setDigest(tagModel.getDigest());
            return Optional.of(detailedModel);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching detailed model info for: " + modelName, e);
        }
    }

}
