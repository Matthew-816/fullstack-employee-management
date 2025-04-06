package com.example.EmployeeManagementSystem.controller.admin;

import com.example.EmployeeManagementSystem.dto.request.EmployeesCrudRequestDTO;
import com.example.EmployeeManagementSystem.exception.EmployeeNotFoundException;
import com.example.EmployeeManagementSystem.service.EmployeesCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/UserCrud")

public class UserEmployeesCrudController {

    private final EmployeesCrudService employeesCrudService;

    @Autowired
    public UserEmployeesCrudController(EmployeesCrudService employeesCrudService) {
        this.employeesCrudService = employeesCrudService;
    }

    // Get all employees
    @GetMapping("/UserReadAll")
    public List<EmployeesCrudRequestDTO> getAllEmployees() {
        List<EmployeesCrudRequestDTO> employees = employeesCrudService.getAllEmployees();
        return employees.stream()
                .map(employee -> EmployeesCrudRequestDTO.builder()
                        .empNo(employee.getEmpNo())
                        .firstName(employee.getFirstName())
                        .lastName(employee.getLastName())
                        .title(employee.getTitle())
                        .birthDate(employee.getBirthDate())
                        .gender(employee.getGender())
                        .deptNo(employee.getDeptNo())
                        .deptName(employee.getDeptName())
                        .salary(employee.getSalary())
                        .hireDate(employee.getHireDate())
                        .fromDate(employee.getFromDate())
                        .toDate(employee.getToDate())
                        .email(employee.getEmail())
                        .build())
                .collect(Collectors.toList());
    }

    // Get an employee by empNo
    @GetMapping("/UserRead/{empNo}")
    public ResponseEntity<?> getEmployeeByEmpNo(@PathVariable Long empNo) {
        EmployeesCrudRequestDTO employee = employeesCrudService.getEmployeeByEmpNo(empNo);
        if (employee == null) {
            throw new EmployeeNotFoundException("Invalid employee number: " + empNo); // Throw exception instead of
                                                                                      // returning
        }
        return ResponseEntity.ok(EmployeesCrudRequestDTO.builder()
                .empNo(employee.getEmpNo())
                .firstName(employee.getFirstName())
                .lastName(employee.getLastName())
                .title(employee.getTitle())
                .birthDate(employee.getBirthDate())
                .gender(employee.getGender())
                .deptNo(employee.getDeptNo())
                .deptName(employee.getDeptName())
                .salary(employee.getSalary())
                .hireDate(employee.getHireDate())
                .fromDate(employee.getFromDate())
                .toDate(employee.getToDate())
                .email(employee.getEmail())
                .build());
    }

}