package com.example.EmployeeManagementSystem.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignInRequestDTO {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

}
