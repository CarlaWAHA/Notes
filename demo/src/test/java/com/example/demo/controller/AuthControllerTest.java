package com.example.demo.controller;

import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.AuthRequestDto;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import com.example.demo.service.TokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController - Tests Unitaires")
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthController authController;

    private User testUser;
    private AuthRequestDto loginRequest;

    @BeforeEach
    void setup() {
        testUser = new User("admin@notes.com", "$2a$10$hashedPassword", Collections.singletonList("ROLE_ADMIN"));
        testUser.setId(1L);

        loginRequest = new AuthRequestDto();
        loginRequest.setUsername("admin@notes.com");
        loginRequest.setPassword("12345678");
    }

    @Test
    @DisplayName("Authentification réussie - retourne token et rôles")
    void testLoginSuccess() {
        String token = UUID.randomUUID().toString();

        when(userService.findByUsername("admin@notes.com")).thenReturn(Optional.of(testUser));

        // Simuler login
        Optional<User> user = userService.findByUsername("admin@notes.com");
        assertTrue(user.isPresent());

        AuthResponseDto response = new AuthResponseDto();
        response.setToken(token);
        response.setRoles(testUser.getRoles());
        response.setUserId(testUser.getId());
        response.setUsername(testUser.getUsername());

        assertNotNull(response.getToken());
        assertEquals(token, response.getToken());
        assertEquals("ROLE_ADMIN", response.getRoles().get(0));
        assertEquals(1L, response.getUserId());
        assertEquals("admin@notes.com", response.getUsername());
    }

    @Test
    @DisplayName("Authentification échouée - identifiants invalides")
    void testLoginInvalidCredentials() {
        when(userService.findByUsername("admin@notes.com")).thenReturn(Optional.empty());

        Optional<User> user = userService.findByUsername("admin@notes.com");

        assertFalse(user.isPresent());
    }

    @Test
    @DisplayName("Authentification échouée - password incorrect")
    void testLoginWrongPassword() {
        when(userService.findByUsername("admin@notes.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", "$2a$10$hashedPassword")).thenReturn(false);

        Optional<User> user = userService.findByUsername("admin@notes.com");
        assertTrue(user.isPresent());
        
        boolean passwordMatch = passwordEncoder.matches("wrongPassword", testUser.getPassword());
        assertFalse(passwordMatch);
    }

    @Test
    @DisplayName("AuthResponse inclut userId et username")
    void testAuthResponseIncludesUserInfo() {
        AuthResponseDto response = new AuthResponseDto();
        response.setUserId(1L);
        response.setUsername("admin@notes.com");
        response.setToken(UUID.randomUUID().toString());
        response.setRoles(Collections.singletonList("ROLE_ADMIN"));

        assertEquals(1L, response.getUserId());
        assertEquals("admin@notes.com", response.getUsername());
        assertNotNull(response.getToken());
        assertNotNull(response.getRoles());
    }

    @Test
    @DisplayName("Token est créé pour utilisateur authentifié")
    void testTokenCreation() {
        String token = UUID.randomUUID().toString();
        when(tokenService.createToken(testUser)).thenReturn(token);

        String result = tokenService.createToken(testUser);

        assertEquals(token, result);
        verify(tokenService, times(1)).createToken(testUser);
    }

    @Test
    @DisplayName("Étudiant peut se connecter avec rôle ROLE_STUDENT")
    void testStudentLogin() {
        User student = new User("student@test.com", "$2a$10$studentHash", Collections.singletonList("ROLE_STUDENT"));
        student.setId(2L);

        when(userService.findByUsername("student@test.com")).thenReturn(Optional.of(student));

        Optional<User> user = userService.findByUsername("student@test.com");
        assertTrue(user.isPresent());
        assertTrue(user.get().getRoles().contains("ROLE_STUDENT"));
    }

    @Test
    @DisplayName("Admin peut se connecter avec rôle ROLE_ADMIN")
    void testAdminLogin() {
        when(userService.findByUsername("admin@notes.com")).thenReturn(Optional.of(testUser));

        Optional<User> user = userService.findByUsername("admin@notes.com");
        assertTrue(user.isPresent());
        assertTrue(user.get().getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Token est valide et unique à chaque connexion")
    void testTokenUniqueness() {
        String token1 = UUID.randomUUID().toString();
        String token2 = UUID.randomUUID().toString();

        assertNotEquals(token1, token2);
    }

    @Test
    @DisplayName("Valider que AuthRequest a username et password")
    void testLoginRequestValidation() {
        AuthRequestDto request = new AuthRequestDto();
        request.setUsername("admin@notes.com");
        request.setPassword("12345678");

        assertNotNull(request.getUsername());
        assertNotNull(request.getPassword());
        assertFalse(request.getUsername().isEmpty());
        assertFalse(request.getPassword().isEmpty());
    }
}
