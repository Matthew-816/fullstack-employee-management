package com.example.EmployeeManagementSystem.controller.admin;

import com.example.EmployeeManagementSystem.dto.request.EmployeesCrudRequestDTO;
import com.example.EmployeeManagementSystem.exception.EmployeeNotFoundException;
import com.example.EmployeeManagementSystem.service.EmployeesCrudService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/AdminCrud")
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // Secure all endpoints for admin only
public class EmployeesCrudController {

    private final EmployeesCrudService employeesCrudService;

    @Autowired
    public EmployeesCrudController(EmployeesCrudService employeesCrudService) {
        this.employeesCrudService = employeesCrudService;
    }

    // Create a new employee
    @PostMapping("/CreateEmployee")
    public EmployeesCrudRequestDTO createEmployee(@Valid @RequestBody EmployeesCrudRequestDTO employeesCrudRequestDTO) {
        EmployeesCrudRequestDTO savedEmployee = employeesCrudService.saveEmployee(employeesCrudRequestDTO);
        return EmployeesCrudRequestDTO.builder()
                .empNo(savedEmployee.getEmpNo())
                .firstName(savedEmployee.getFirstName())
                .lastName(savedEmployee.getLastName())
                .title(savedEmployee.getTitle())
                .birthDate(savedEmployee.getBirthDate())
                .gender(savedEmployee.getGender())
                .deptNo(savedEmployee.getDeptNo())
                .deptName(savedEmployee.getDeptName())
                .salary(savedEmployee.getSalary())
                .hireDate(savedEmployee.getHireDate())
                .fromDate(savedEmployee.getFromDate())
                .toDate(savedEmployee.getToDate())
                .email(savedEmployee.getEmail())
                .build();
    }

    // Get all employees
    @GetMapping("/ReadAllEmployee")
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
    @GetMapping("/ReadEmployee/{empNo}")
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

    // Update an employee
    @PutMapping("/EditEmployee/{empNo}")
    public EmployeesCrudRequestDTO updateEmployee(
            @PathVariable Long empNo, @Valid @RequestBody EmployeesCrudRequestDTO employeeDetails) {
        if (!employeesCrudService.employeeExists(empNo)) {
            throw new RuntimeException("Employee not found with empNo: " + empNo);
        }
        employeeDetails.setEmpNo(empNo); // Ensure empNo matches the path variable
        EmployeesCrudRequestDTO updatedEmployee = employeesCrudService.saveEmployee(employeeDetails);
        return EmployeesCrudRequestDTO.builder()
                .empNo(updatedEmployee.getEmpNo())
                .firstName(updatedEmployee.getFirstName())
                .lastName(updatedEmployee.getLastName())
                .title(updatedEmployee.getTitle())
                .birthDate(updatedEmployee.getBirthDate())
                .gender(updatedEmployee.getGender())
                .deptNo(updatedEmployee.getDeptNo())
                .deptName(updatedEmployee.getDeptName())
                .salary(updatedEmployee.getSalary())
                .hireDate(updatedEmployee.getHireDate())
                .fromDate(updatedEmployee.getFromDate())
                .toDate(updatedEmployee.getToDate())
                .email(updatedEmployee.getEmail())
                .build();
    }

    // Delete an employee
    @DeleteMapping("/DeleteEmployee/{empNo}")
    public void deleteEmployee(@PathVariable Long empNo) {
        if (!employeesCrudService.employeeExists(empNo)) {
            throw new RuntimeException("Employee not found with empNo: " + empNo);
        }
        employeesCrudService.deleteEmployee(empNo);
    }
}