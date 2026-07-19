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
        ensureAdminAccount("admin@trust.com");
        // Keep legacy account for backward compatibility with existing users/tests.
        ensureAdminAccount("admin@notes.com");
    }

    private void ensureAdminAccount(String username) {
        Optional<User> existingAdmin = userRepository.findByUsername(username);
        if (existingAdmin.isEmpty()) {
            User admin = new User(username, passwordEncoder.encode("12345678"), List.of("ROLE_ADMIN"));
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
        String normalizedUsername = username == null ? "" : username.trim();
        if (normalizedUsername.isBlank()) {
            return Optional.empty();
        }

        if (userRepository.findByUsernameIgnoreCase(normalizedUsername).isPresent()) {
            return Optional.empty();
        }

        User student = new User(normalizedUsername, passwordEncoder.encode(rawPassword), List.of("ROLE_STUDENT"));
        User savedStudent = userRepository.save(student);
        return Optional.of(savedStudent);
    }

    public boolean checkPassword(User user, String rawPassword) {
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    public Optional<User> updateStudentAccount(Long userId, String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();
        String normalizedUsername = username.trim();
        Optional<User> existingUsername = userRepository.findByUsernameIgnoreCase(normalizedUsername);
        if (existingUsername.isPresent() && !existingUsername.get().getId().equals(userId)) {
            return Optional.empty();
        }

        user.setUsername(normalizedUsername);
        if (rawPassword != null && !rawPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        return Optional.of(userRepository.save(user));
    }
}
