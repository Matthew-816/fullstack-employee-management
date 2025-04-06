package com.example.EmployeeManagementSystem.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeesCrudRequestDTO {

    private Long empNo;
    private String firstName;
    private String lastName;
    private String title;
    private Date birthDate;
    private String gender;
    private String deptNo;
    private String deptName;
    private Double salary;
    private Date hireDate;
    private Date fromDate;
    private Date toDate;
    private String email;
}
