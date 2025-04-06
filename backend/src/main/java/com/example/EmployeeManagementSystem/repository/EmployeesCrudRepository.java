package com.example.EmployeeManagementSystem.repository;

import com.example.EmployeeManagementSystem.model.EmployeesCrud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeesCrudRepository extends JpaRepository<EmployeesCrud, Long> {
    EmployeesCrud findByEmpNo(Long empNo);

}
