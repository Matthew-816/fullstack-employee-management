package com.example.EmployeeManagementSystem.controller.admin;

import com.example.EmployeeManagementSystem.config.JwtUtil;
import com.example.EmployeeManagementSystem.dto.request.SignInRequestDTO;
import com.example.EmployeeManagementSystem.dto.response.SignInResponseDTO;
import com.example.EmployeeManagementSystem.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/SignIn")
public class SignInController {
    private static final Logger logger = LoggerFactory.getLogger(SignInController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/User")
    public SignInResponseDTO signInUser(@Valid @RequestBody SignInRequestDTO signInRequestDTO) {
        logger.info("User sign-in attempt for email: {}", signInRequestDTO.getEmail());

        UserDetails userDetails = userService.loadUserByUsername(signInRequestDTO.getEmail());
        if (userDetails == null) {
            logger.warn("Invalid email: {}", signInRequestDTO.getEmail());
            throw new RuntimeException("Invalid email");
        }
        if (!passwordEncoder.matches(signInRequestDTO.getPassword(), userDetails.getPassword())) {
            logger.warn("Invalid password for email: {}", signInRequestDTO.getEmail());
            throw new RuntimeException("Invalid password");
        }

        String jwtToken = jwtUtil.generateToken(userDetails);
        logger.info("Generated JWT token for user: {}", signInRequestDTO.getEmail());
        return SignInResponseDTO.builder()
                .email(signInRequestDTO.getEmail())
                .token(jwtToken)
                .build();
    }

    @PostMapping("/Admin")
    public SignInResponseDTO signInAdmin(@Valid @RequestBody SignInRequestDTO signInRequestDTO) {
        logger.info("Admin sign-in attempt for email: {}", signInRequestDTO.getEmail());

        UserDetails adminDetails = userService.loadUserByUsername(signInRequestDTO.getEmail());
        if (adminDetails == null) {
            logger.warn("Invalid email: {}", signInRequestDTO.getEmail());
            throw new RuntimeException("Invalid email");
        }
        if (!passwordEncoder.matches(signInRequestDTO.getPassword(), adminDetails.getPassword())) {
            logger.warn("Invalid password for email: {}", signInRequestDTO.getEmail());
            throw new RuntimeException("Invalid password");
        }

        String jwtToken = jwtUtil.generateToken(adminDetails);
        logger.info("Generated JWT token for admin: {}", signInRequestDTO.getEmail());
        return SignInResponseDTO.builder()
                .email(signInRequestDTO.getEmail())
                .token(jwtToken)
                .build();
    }
}