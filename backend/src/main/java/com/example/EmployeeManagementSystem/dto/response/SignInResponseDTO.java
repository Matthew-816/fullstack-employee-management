package com.example.EmployeeManagementSystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignInResponseDTO {
    private String email;
    private String token;
}
