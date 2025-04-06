package com.example.EmployeeManagementSystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SignUpResponseDTO {
    private String email;
    private String token;
}
