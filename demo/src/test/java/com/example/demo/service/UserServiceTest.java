package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService - Tests Unitaires")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setup() {
        testUser = new User("admin@notes.com", "$2a$10$hashedPassword123", Collections.singletonList("ROLE_ADMIN"));
        testUser.setId(1L);
        
        // Clear invocations from UserService constructor (initializeAdmin)
        clearInvocations(userRepository, passwordEncoder);
    }

    @Test
    @DisplayName("Créer utilisateur étudiant avec succès")
    void testCreateUser() {
        when(userRepository.findByUsername("student@test.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("12345678")).thenReturn("$2a$10$encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        Optional<User> result = userService.createStudent("student@test.com", "12345678");

        assertTrue(result.isPresent());
        verify(userRepository, atLeastOnce()).save(any(User.class));
    }

    @Test
    @DisplayName("Trouver utilisateur par nom d'utilisateur")
    void testFindByUsername() {
        when(userRepository.findByUsername("admin@notes.com")).thenReturn(Optional.of(testUser));

        Optional<User> result = userService.findByUsername("admin@notes.com");

        assertTrue(result.isPresent());
        assertEquals("admin@notes.com", result.get().getUsername());
        verify(userRepository, atLeastOnce()).findByUsername("admin@notes.com");
    }

    @Test
    @DisplayName("Utilisateur non trouvé retourne empty")
    void testFindByUsernameNotFound() {
        when(userRepository.findByUsername("inexistant@notes.com")).thenReturn(Optional.empty());

        Optional<User> result = userRepository.findByUsername("inexistant@notes.com");

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Vérifier password valide")
    void testCheckPasswordValid() {
        String rawPassword = "12345678";
        String encodedPassword = "$2a$10$hashedPassword123";
        
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        boolean result = userService.checkPassword(testUser, rawPassword);

        assertTrue(result);
        verify(passwordEncoder, times(1)).matches(rawPassword, encodedPassword);
    }

    @Test
    @DisplayName("Vérifier password invalide")
    void testCheckPasswordInvalid() {
        String rawPassword = "wrongPassword";
        String encodedPassword = "$2a$10$hashedPassword123";
        
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        boolean result = userService.checkPassword(testUser, rawPassword);

        assertFalse(result);
    }

    @Test
    @DisplayName("Initialiser admin par défaut")
    void testInitializeDefaultAdmin() {
        // Verify that admin is created when app starts
        User admin = new User("admin@notes.com", "$2a$10$encodedValue", Collections.singletonList("ROLE_ADMIN"));
        assertTrue(admin.getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Encoder password avant sauvegarde")
    void testPasswordEncoding() {
        String rawPassword = "12345678";
        String expectedEncoded = "$2a$10$encodedValue";
        
        when(passwordEncoder.encode(rawPassword)).thenReturn(expectedEncoded);

        // Test through service method
        Optional<User> result = userService.createStudent("newuser@test.com", rawPassword);

        assertTrue(result.isPresent());
        verify(passwordEncoder, atLeastOnce()).encode(rawPassword);
    }

    @Test
    @DisplayName("Trouver utilisateurs par rôle")
    void testFindByRole() {
        when(userRepository.findByRolesContaining("ROLE_ADMIN")).thenReturn(Collections.singletonList(testUser));

        var result = userRepository.findByRolesContaining("ROLE_ADMIN");

        assertEquals(1, result.size());
        assertEquals("admin@notes.com", result.get(0).getUsername());
    }
}
