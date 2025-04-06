package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.dto.request.EmployeesCrudRequestDTO;
import com.example.EmployeeManagementSystem.model.EmployeesCrud;
import com.example.EmployeeManagementSystem.repository.EmployeesCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeesCrudService {

    private final EmployeesCrudRepository employeesCrudRepository;

    @Autowired
    public EmployeesCrudService(EmployeesCrudRepository employeesCrudRepository) {
        this.employeesCrudRepository = employeesCrudRepository;
    }

    // Save an employee
    public EmployeesCrudRequestDTO saveEmployee(EmployeesCrudRequestDTO employeeDTO) {
        EmployeesCrud employeeEntity = mapDtoToEntity(employeeDTO);
        if (employeeDTO.getEmpNo() != null && employeesCrudRepository.existsById(employeeDTO.getEmpNo())) {
            // Update existing entity
            employeeEntity.setEmpNo(employeeDTO.getEmpNo());
        } else {
            // New entity, let DB assign empNo
            employeeEntity.setEmpNo(null);
        }
        EmployeesCrud savedEntity = employeesCrudRepository.save(employeeEntity);
        return mapEntityToDto(savedEntity);
    }

    // Get all employees
    public List<EmployeesCrudRequestDTO> getAllEmployees() {
        return employeesCrudRepository.findAll().stream()
                .map(this::mapEntityToDto)
                .toList();
    }

    // Get an employee by empNo
    public EmployeesCrudRequestDTO getEmployeeByEmpNo(Long empNo) {
        Optional<EmployeesCrud> employeeOptional = employeesCrudRepository.findById(empNo);
        return employeeOptional.map(this::mapEntityToDto)
                .orElse(null); // Return null if not found, or throw an exception if preferred
    }

    // Delete an employee by ID
    public void deleteEmployee(Long empNo) {
        employeesCrudRepository.deleteById(empNo);
    }

    // Check if an employee exists
    public boolean employeeExists(Long empNo) {
        return employeesCrudRepository.existsById(empNo);
    }

    // Map DTO to Entity
    private EmployeesCrud mapDtoToEntity(EmployeesCrudRequestDTO dto) {
        EmployeesCrud entity = new EmployeesCrud();
        entity.setEmpNo(dto.getEmpNo());
        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setTitle(dto.getTitle());
        entity.setBirthDate(dto.getBirthDate());
        entity.setGender(dto.getGender());
        entity.setDeptNo(dto.getDeptNo());
        entity.setDeptName(dto.getDeptName());
        entity.setSalary(dto.getSalary());
        entity.setHireDate(dto.getHireDate());
        entity.setFromDate(dto.getFromDate());
        entity.setToDate(dto.getToDate());
        entity.setEmail(dto.getEmail());
        return entity;
    }

    // Map Entity to DTO
    private EmployeesCrudRequestDTO mapEntityToDto(EmployeesCrud entity) {
        EmployeesCrudRequestDTO dto = new EmployeesCrudRequestDTO();
        dto.setEmpNo(entity.getEmpNo());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setTitle(entity.getTitle());
        dto.setBirthDate(entity.getBirthDate());
        dto.setGender(entity.getGender());
        dto.setDeptNo(entity.getDeptNo());
        dto.setDeptName(entity.getDeptName());
        dto.setSalary(entity.getSalary());
        dto.setHireDate(entity.getHireDate());
        dto.setFromDate(entity.getFromDate());
        dto.setToDate(entity.getToDate());
        dto.setEmail(entity.getEmail());
        return dto;
    }
}