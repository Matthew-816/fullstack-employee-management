package com.example.EmployeeManagementSystem.controller.admin;

import com.example.EmployeeManagementSystem.config.JwtUtil;
import com.example.EmployeeManagementSystem.dto.request.SignUpRequestDTO;
import com.example.EmployeeManagementSystem.dto.response.SignUpResponseDTO;
import com.example.EmployeeManagementSystem.service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/SignUp")
public class SignUpController {

    @Value("${admin.secret.code}")
    private String adminSecretCode;

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    public SignUpController(UserService userService, BCryptPasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/User")
    public SignUpResponseDTO signUpUser(@Valid @RequestBody SignUpRequestDTO requestDTO) {
        log.info("Raw request DTO: {}", requestDTO.toString()); // Log the entire DTO
        log.info("Email from DTO: {}", requestDTO.getEmail()); // Log just the email

        // Check if the user already exists
        if (userService.userExists(requestDTO.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        String hashedPassword = passwordEncoder.encode(requestDTO.getPassword());
        userService.saveUser(requestDTO.getEmail(), hashedPassword);
        log.info("User saved, loading: {}", requestDTO.getEmail());
        UserDetails userDetails = userService.loadUserByUsername(requestDTO.getEmail());

        String jwtToken = jwtUtil.generateToken(userDetails);

        return SignUpResponseDTO.builder()
                .email(requestDTO.getEmail())
                .token(jwtToken)
                .build();
    }

    @PostMapping("/Admin")
    public SignUpResponseDTO signUpAdmin(@Valid @RequestBody SignUpRequestDTO requestDTO) {
        log.info("Raw request DTO: {} ", requestDTO.toString()); // Log the entire DTO
        log.info("Email from DTO: {} ", requestDTO.getEmail()); // Log just the email

        // Check if the user already exists
        if (userService.userExists(requestDTO.getEmail())) {
            throw new RuntimeException("Admin already exists");
        }

        if (!adminSecretCode.equals(requestDTO.getSecretCode())) {
            log.info("secret code mismatch: expect{} ", adminSecretCode);
            return SignUpResponseDTO.builder()
                    .email(requestDTO.getEmail())
                    .token("wrong secretCode")
                    .build();
        }

        String hashedPassword = passwordEncoder.encode(requestDTO.getPassword());
        userService.saveAdmin(requestDTO.getEmail(), hashedPassword);

        log.info("admin saved, load{}", requestDTO.getEmail());

        UserDetails userDetails = userService.loadUserByUsername(requestDTO.getEmail());

        String jwtToken = jwtUtil.generateToken(userDetails);

        return SignUpResponseDTO.builder()
                .email(requestDTO.getEmail())
                .token(jwtToken)
                .build();
    }

}
