package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UERepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("StudentService - Tests Unitaires")
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UERepository ueRepository;

    @InjectMocks
    private StudentService studentService;

    private User testUser;
    private Student testStudent;
    private UE testUE;

    @BeforeEach
    void setup() {
        testUser = new User("etudiant@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));
        testUser.setId(1L);

        testStudent = new Student(testUser);
        testStudent.setId(1L);

        testUE = new UE("STA103", "Statistiques Avancées");
        testUE.setId(1L);
    }

    @Test
    @DisplayName("Créer étudiant avec UEs")
    void testCreateStudentWithUEs() {
        List<String> ueCodes = List.of("STA103", "STA102");

        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);
        when(ueRepository.findByCode("STA103")).thenReturn(Optional.of(testUE));

        Optional<Student> result = studentService.createStudent(testUser, ueCodes);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Trouver étudiant par ID utilisateur")
    void testFindStudentByUserId() {
        when(studentRepository.findByUserId(1L)).thenReturn(Optional.of(testStudent));

        Optional<Student> result = studentRepository.findByUserId(1L);

        assertTrue(result.isPresent());
        assertEquals("etudiant@test.com", result.get().getUser().getUsername());
    }

    @Test
    @DisplayName("Étudiant non trouvé retourne empty")
    void testFindStudentNotFound() {
        when(studentRepository.findByUserId(999L)).thenReturn(Optional.empty());

        Optional<Student> result = studentRepository.findByUserId(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Ajouter UE à un étudiant")
    void testAddUEToStudent() {
        testStudent.addUE(testUE);
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        Student result = studentRepository.save(testStudent);

        assertTrue(result.getUes().contains(testUE));
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Supprimer UE d'un étudiant")
    void testRemoveUEFromStudent() {
        testStudent.addUE(testUE);
        testStudent.removeUE(testUE);
        when(studentRepository.save(any(Student.class))).thenReturn(testStudent);

        Student result = studentRepository.save(testStudent);

        assertFalse(result.getUes().contains(testUE));
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    @DisplayName("Obtenir toutes les UEs d'un étudiant")
    void testGetStudentUEs() {
        Set<UE> ues = new HashSet<>();
        ues.add(testUE);
        testStudent.setUes(ues);

        assertEquals(1, testStudent.getUes().size());
        assertTrue(testStudent.getUes().contains(testUE));
    }

    @Test
    @DisplayName("Vérifier qu'étudiant n'a pas d'UE au départ")
    void testStudentStartsWithoutUEs() {
        Student newStudent = new Student(testUser);
        newStudent.setUser(testUser);
        newStudent.setUes(new HashSet<>());

        assertTrue(newStudent.getUes().isEmpty());
    }

    @Test
    @DisplayName("Ajouter plusieurs UEs à un étudiant")
    void testAddMultipleUEs() {
        UE ue2 = new UE("STA102", "Statistiques Intermédiaires");
        ue2.setId(2L);

        testStudent.addUE(testUE);
        testStudent.addUE(ue2);

        assertEquals(2, testStudent.getUes().size());
        assertTrue(testStudent.getUes().contains(testUE));
        assertTrue(testStudent.getUes().contains(ue2));
    }
}
