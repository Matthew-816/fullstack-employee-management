package com.example.EmployeeManagementSystem.service;

import com.example.EmployeeManagementSystem.aiModel.AiApiClient;
import com.example.EmployeeManagementSystem.dto.response.AiChatBoxResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.text.SimpleDateFormat;
import java.util.List;

@Service
public class AiChatBoxService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private AiApiClient aiApiClient;

    public List<AiChatBoxResponseDTO> searchEmployees(String description) throws Exception {
        String sqlQuery = getSqlQueryFromAI(description);
        return executeSqlQuery(sqlQuery);
    }

    private String getSqlQueryFromAI(String description) throws Exception {
        String prompt = "Generate a valid SQL SELECT query for a table named 'employees_crud' with columns emp_no, first_name, last_name, gender, birth_date, hire_date, dept_no, dept_name, title, salary, from_date, to_date, email based on this description: " + description + ". Ensure the query starts with 'SELECT' and is syntactically correct.";
        return aiApiClient.getSqlQuery(prompt);
    }

    private List<AiChatBoxResponseDTO> executeSqlQuery(String sqlQuery) throws Exception {
        if (!sqlQuery.trim().toLowerCase().startsWith("select")) {
            return List.of(AiChatBoxResponseDTO.builder().firstName("Error: Only SELECT queries are allowed").build());
        }

        try {
            return jdbcTemplate.query(sqlQuery, (rs, rowNum) -> {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                return AiChatBoxResponseDTO.builder()
                        .empNo(rs.getLong("emp_no"))
                        .firstName(rs.getString("first_name"))
                        .lastName(rs.getString("last_name"))
                        .gender(rs.getString("gender"))
                        .birthDate(rs.getDate("birth_date") != null ? sdf.format(rs.getDate("birth_date")) : null)
                        .hireDate(rs.getDate("hire_date") != null ? sdf.format(rs.getDate("hire_date")) : null)
                        .deptNo(rs.getString("dept_no"))
                        .deptName(rs.getString("dept_name"))
                        .title(rs.getString("title"))
                        .salary(rs.getDouble("salary"))
                        .fromDate(rs.getDate("from_date") != null ? sdf.format(rs.getDate("from_date")) : null)
                        .toDate(rs.getDate("to_date") != null ? sdf.format(rs.getDate("to_date")) : null)
                        .email(rs.getString("email"))
                        .build();
            });
        } catch (Exception e) {
            return List.of(AiChatBoxResponseDTO.builder().firstName("Error: Invalid query - " + e.getMessage()).build());
        }
    }
}