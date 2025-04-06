package com.example.EmployeeManagementSystem;

import com.example.EmployeeManagementSystem.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;
    private final String testSecretKey = "this_is_a_very_strong_secret_key_1234567890";

    @BeforeEach
    public void setUp() {
        // Initialize JwtUtil with the test secret key
        jwtUtil = new JwtUtil(testSecretKey);
    }

    @Test
    public void testGenerateAndValidateToken() {
        // Mock UserDetails
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        // Generate token
        String token = jwtUtil.generateToken(userDetails);

        // Validate token
        assertTrue(jwtUtil.validateToken(token, userDetails));

        // Extract email from the token
        String email = jwtUtil.extractEmail(token);
        assertEquals("test@example.com", email);

    }

    @Test
    public void testExtractExpiration() {
        // Mock UserDetails
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        // Generate token
        String token = jwtUtil.generateToken(userDetails);

        // Extract expiration date
        Date expirationDate = jwtUtil.extractExpiration(token);

        // Check if the expiration date is in the future
        assertTrue(expirationDate.after(new Date()));
    }

    @Test
    public void testInvalidToken() {
        // Mock UserDetails
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        // Generate token
        String token = jwtUtil.generateToken(userDetails);

        // Modify the token to make it invalid
        String invalidToken = token + "invalid";

        // Validate the invalid token
        assertThrows(RuntimeException.class, () -> jwtUtil.validateToken(invalidToken, userDetails));
    }

    @Test
    public void testExpiredToken() {
        // Mock UserDetails
        UserDetails userDetails = User.withUsername("test@example.com")
                .password("password")
                .authorities("ROLE_USER")
                .build();

        // Create a new JwtUtil instance with a very short expiration time (1
        // millisecond)
        JwtUtil shortExpirationJwtUtil = new JwtUtil(testSecretKey);

        // Generate token
        String token = shortExpirationJwtUtil.generateToken(userDetails);

        // Wait for the token to expire
        try {
            Thread.sleep(2); // Wait for 2 milliseconds
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Validate the expired token
        assertThrows(RuntimeException.class, () -> shortExpirationJwtUtil.validateToken(token, userDetails));
    }
}
