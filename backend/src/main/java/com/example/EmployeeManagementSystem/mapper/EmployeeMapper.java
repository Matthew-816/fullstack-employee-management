package com.example.EmployeeManagementSystem.mapper;

import com.example.EmployeeManagementSystem.dto.request.EmployeesCrudRequestDTO;
import com.example.EmployeeManagementSystem.model.EmployeesCrud;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EmployeeMapper {
    EmployeesCrud toEntity(EmployeesCrudRequestDTO dto);

    EmployeesCrudRequestDTO toDto(EmployeesCrud entity);
}