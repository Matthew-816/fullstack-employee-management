package com.example.EmployeeManagementSystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiChatBoxResponseDTO {
    private Long empNo;
    private String firstName;
    private String lastName;
    private String gender;
    private String birthDate;
    private String hireDate;
    private String deptNo;
    private String deptName;
    private String title;
    private Double salary;
    private String fromDate;
    private String toDate;
    private String email;
}
