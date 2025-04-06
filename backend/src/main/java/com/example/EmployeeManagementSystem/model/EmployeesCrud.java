package com.example.EmployeeManagementSystem.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Table(name = "employees_crud")
@Data
public class EmployeesCrud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long empNo;

    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Column(name = "title", length = 50)
    private String title;

    @Column(name = "birth_date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date birthDate;

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "dept_no", length = 4)
    private String deptNo;

    @Column(name = "dept_name", length = 40)
    private String deptName;

    @Column(name = "salary")
    private Double salary;

    @Column(name = "hire_date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date hireDate;

    @Column(name = "from_date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date fromDate;

    @Column(name = "to_date")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date toDate;

    @Column(name = "email", unique = true, nullable = false)
    private String email;
}