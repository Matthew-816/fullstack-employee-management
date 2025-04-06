package com.example.EmployeeManagementSystem.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="app_user")
@Data
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String hashedPassword;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;  // Default role for all users
}