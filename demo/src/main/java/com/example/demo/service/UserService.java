package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        initializeAdmin();
    }

    private void initializeAdmin() {
        Optional<User> existingAdmin = userRepository.findByUsername("admin@notes.com");
        if (existingAdmin.isEmpty()) {
            User admin = new User("admin@notes.com", passwordEncoder.encode("12345678"), List.of("ROLE_ADMIN"));
            userRepository.save(admin);
        }
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getStudents() {
        return userRepository.findByRolesContaining("ROLE_STUDENT");
    }

    public Optional<User> createStudent(String username, String rawPassword) {
        if (userRepository.findByUsername(username).isPresent()) {
            return Optional.empty();
        }

        User student = new User(username, passwordEncoder.encode(rawPassword), List.of("ROLE_STUDENT"));
        User savedStudent = userRepository.save(student);
        return Optional.of(savedStudent);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }
}
