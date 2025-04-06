package com.example.EmployeeManagementSystem.aiModel;

public interface AiApiClient {
    String getSqlQuery(String prompt) throws Exception;
    String getApiKey();
    String getApiUrl();
}
