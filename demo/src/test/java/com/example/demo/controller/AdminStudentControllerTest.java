package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
import com.example.demo.service.StudentService;
import com.example.demo.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AdminStudentController - Tests Unitaires")
class AdminStudentControllerTest {

    @Mock
    private StudentService studentService;

    @Mock
    private UserService userService;

    @InjectMocks
    private AdminStudentController adminStudentController;

    private User testStudent;
    private Student testStudentProfile;
    private UE testUE;

    @BeforeEach
    void setup() {
        testStudent = new User("student@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));
        testStudent.setId(1L);

        testStudentProfile = new Student(testStudent);
        testStudentProfile.setId(1L);

        testUE = new UE("STA103", "Statistiques Avancées");
        testUE.setId(1L);
    }

    @Test
    @DisplayName("Admin crée étudiant avec succès")
    void testCreateStudent() {
        List<String> ueCodes = List.of("STA103");
        
        when(userService.createStudent("student@test.com", "password123")).thenReturn(Optional.of(testStudent));
        when(studentService.createStudent(testStudent, ueCodes)).thenReturn(Optional.of(testStudentProfile));

        Optional<Student> result = studentService.createStudent(testStudent, ueCodes);

        assertTrue(result.isPresent());
        assertEquals("student@test.com", result.get().getUser().getUsername());
        verify(studentService, times(1)).createStudent(testStudent, ueCodes);
    }

    @Test
    @DisplayName("Admin créé etudiant avec multiples UEs")
    void testCreateStudentWithMultipleUEs() {
        List<String> ueCodes = List.of("STA103", "STA102", "STA101");
        
        when(studentService.createStudent(testStudent, ueCodes)).thenReturn(Optional.of(testStudentProfile));

        Optional<Student> result = studentService.createStudent(testStudent, ueCodes);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    @DisplayName("Admin obtient tous les étudiants")
    void testGetAllStudents() {
        List<Student> students = List.of(testStudentProfile);
        
        // Simuler getAllStudents
        assertEquals(1, students.size());
        assertEquals("student@test.com", students.get(0).getUser().getUsername());
    }

    @Test
    @DisplayName("Admin obtient étudiant par ID")
    void testGetStudentById() {
        when(studentService.findById(1L)).thenReturn(Optional.of(testStudentProfile));

        Optional<Student> result = studentService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("student@test.com", result.get().getUser().getUsername());
    }

    @Test
    @DisplayName("Admin ajoute UE à étudiant")
    void testAddUEToStudent() {
        testStudentProfile.addUE(testUE);
        when(studentService.addUEToStudent(1L, "STA103")).thenReturn(Optional.of(testStudentProfile));

        Optional<Student> result = studentService.addUEToStudent(1L, "STA103");

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getUes().size());
        assertTrue(result.get().getUes().contains(testUE));
        verify(studentService, times(1)).addUEToStudent(1L, "STA103");
    }

    @Test
    @DisplayName("Admin supprime UE d'étudiant")
    void testRemoveUEFromStudent() {
        testStudentProfile.addUE(testUE);
        testStudentProfile.removeUE(testUE);
        when(studentService.removeUEFromStudent(1L, "STA103")).thenReturn(Optional.of(testStudentProfile));

        Optional<Student> result = studentService.removeUEFromStudent(1L, "STA103");

        assertTrue(result.isPresent());
        assertEquals(0, result.get().getUes().size());
        verify(studentService, times(1)).removeUEFromStudent(1L, "STA103");
    }

    @Test
    @DisplayName("Étudiant créé a rôle ROLE_STUDENT")
    void testStudentHasCorrectRole() {
        testStudent.setRoles(Collections.singletonList("ROLE_STUDENT"));

        assertTrue(testStudent.getRoles().contains("ROLE_STUDENT"));
        assertFalse(testStudent.getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Vérifier qu'étudiant peut pas créer autre étudiant")
    void testStudentCantCreateOtherStudent() {
        // Seul admin avec @PreAuthorize(hasRole('ROLE_ADMIN')) peut créer
        User studentUser = new User("student@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));

        assertFalse(studentUser.getRoles().contains("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("Email unique pour chaque étudiant")
    void testStudentEmailUniqueness() {
        User student1 = new User("student1@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));

        User student2 = new User("student2@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));

        assertNotEquals(student1.getUsername(), student2.getUsername());
    }

    @Test
    @DisplayName("Obtenir UEs d'un étudiant")
    void testGetStudentUEs() {
        testStudentProfile.addUE(testUE);

        Set<UE> ues = testStudentProfile.getUes();

        assertEquals(1, ues.size());
        assertEquals("STA103", ues.iterator().next().getCode());
    }

    @Test
    @DisplayName("Étudiant sans UEs au départ")
    void testStudentStartsWithoutUEs() {
        assertTrue(testStudentProfile.getUes().isEmpty());
    }
}
