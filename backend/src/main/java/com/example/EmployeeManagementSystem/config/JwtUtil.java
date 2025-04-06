package com.example.EmployeeManagementSystem.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);

    private final SecretKey secretKey; // Symmetric key for HS256
    private static final long EXPIRATION_TIME = 86_400_000; // 1 day in milliseconds

    // Constructor to inject the secret key from application.properties
    public JwtUtil(@Value("${jwt.secret.key}") String secretKey) {
        // Ensure the key is strong (at least 256 bits / 32 bytes for HS256)
        this.secretKey = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        logger.info("JWT Secret Key initialized for HS256");
    }

    // Extract email (subject) from the token
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract expiration date from the token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Generic method to extract a specific claim
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey) // Use the same symmetric key for verification
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException ex) {
            logger.warn("Token expired: {}", ex.getMessage());
            throw new RuntimeException("Token expired", ex);
        } catch (MalformedJwtException ex) {
            logger.warn("Invalid token format: {}", ex.getMessage());
            throw new RuntimeException("Invalid token", ex);
        } catch (@SuppressWarnings("deprecation") SignatureException ex) {
            logger.warn("Invalid token signature: {}", ex.getMessage());
            throw new RuntimeException("Invalid token signature", ex);
        } catch (Exception ex) {
            logger.error("Error parsing token: {}", ex.getMessage());
            throw new RuntimeException("Error parsing token", ex);
        }
    }

    // Check if the token is expired
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generate a JWT token for the given user details
    public String generateToken(UserDetails userDetails) {
        logger.info("Generating HS256 token for user: {}", userDetails.getUsername());
        logger.info("generate token");
        Map<String, Object> claims = new HashMap<>();
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        return createToken(claims, userDetails.getUsername());
    }

    // Create a JWT token with claims and subject
    private String createToken(Map<String, Object> claims, String subject) {
        logger.info("create token");
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256) // Explicitly use HS256
                .compact();
    }

    // Validate the token against user details
    public Boolean validateToken(String token, UserDetails userDetails) {
        logger.info("Validating token for user: {}", userDetails.getUsername());
        try {
            final String email = extractEmail(token);
            boolean isExpired = isTokenExpired(token);
            boolean emailMatches = email.equals(userDetails.getUsername());
            logger.info("Token email: {}, User email: {}, Expired: {}", email, userDetails.getUsername(), isExpired);
            return emailMatches && !isExpired;
        } catch (RuntimeException e) {
            logger.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }
}
