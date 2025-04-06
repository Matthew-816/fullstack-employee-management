package com.example.EmployeeManagementSystem.aiModel;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;

import java.util.List;
import java.util.Map;

@Component
public class TogetherAiApiClient implements AiApiClient {

    private final String apiKey;
    private final String apiUrl;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public TogetherAiApiClient(
            @Value("${ai.api.key}") String apiKey,
            @Value("${ai.api.url}") String apiUrl,
            RestTemplateBuilder restTemplateBuilder, // Use RestTemplateBuilder
            ObjectMapper objectMapper) {
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.restTemplate = restTemplateBuilder.build(); // Build RestTemplate
        this.objectMapper = objectMapper;
    }

    @Override
    public String getSqlQuery(String prompt) throws Exception {
        String requestBody = objectMapper.writeValueAsString(
                Map.of(
                        "model", "meta-llama/Llama-3.3-70B-Instruct-Turbo",
                        "messages", List.of(Map.of("role", "user", "content", prompt)),
                        "max_tokens", 500));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + getApiKey());
        headers.set("Content-Type", "application/json");

        String response = restTemplate.postForObject(
                getApiUrl(),
                new HttpEntity<>(requestBody, headers),
                String.class);

        System.out.println("Raw AI response: " + response);

        JsonNode jsonNode = objectMapper.readTree(response);
        JsonNode choices = jsonNode.get("choices");
        if (choices != null && choices.isArray() && choices.size() > 0) {
            String rawQuery = choices.get(0).get("message").get("content").asText().trim();
            System.out.println("Extracted raw query: " + rawQuery);

            String cleanedQuery = rawQuery
                    .replaceAll("(?s)```sql\\s*(.*?)\\s*```", "$1")
                    .replaceAll("(?s)```\\s*(.*?)\\s*```", "$1")
                    .trim();

            System.out.println("Cleaned SQL query: " + cleanedQuery);
            return cleanedQuery;
        } else {
            throw new Exception("Invalid AI response: no choices found");
        }
    }

    @Override
    public String getApiKey() {
        return apiKey;
    }

    @Override
    public String getApiUrl() {
        return apiUrl;
    }
}