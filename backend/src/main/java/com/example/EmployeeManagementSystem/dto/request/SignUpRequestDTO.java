package com.example.EmployeeManagementSystem.dto.request;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class SignUpRequestDTO {
    @Email
    private String email;

    @NotBlank
    private String password;

    private String secretCode;

    private String role;
}
