package com.example.EmployeeManagementSystem.service;
import com.example.EmployeeManagementSystem.model.AppUser;
import com.example.EmployeeManagementSystem.model.Role;
import com.example.EmployeeManagementSystem.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Collection;
import java.util.Collections;


@Service
public class UserService implements UserDetailsService {  // Implement UserDetailsService

    private final UserRepository userRepository;


    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void saveUser(String email, String hashedPassword) { // Take hashed password directly
        AppUser appUserEntity = new AppUser();
        appUserEntity.setEmail(email);
        appUserEntity.setHashedPassword(hashedPassword);
        appUserEntity.setRole(Role.USER);
        userRepository.save(appUserEntity);
    }

    public void saveAdmin(String email, String hashedPassword){
        AppUser appAdminEntity= new AppUser();
        appAdminEntity.setEmail(email);
        appAdminEntity.setHashedPassword(hashedPassword);
        appAdminEntity.setRole(Role.ADMIN);
        userRepository.save(appAdminEntity);

    }

    public boolean userExists(String email) {
        // Check if a user with the given email exists in the database
        return userRepository.existsByEmail(email);
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {  // Implement the method from UserDetailsService
        // Load user from the database based on the email
        AppUser appUserEntity = userRepository.findByEmail(email);

        if (appUserEntity == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        Collection<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + appUserEntity.getRole().name()));


        return new User(
                appUserEntity.getEmail(),
                appUserEntity.getHashedPassword(),
                authorities
        );
    }
}
