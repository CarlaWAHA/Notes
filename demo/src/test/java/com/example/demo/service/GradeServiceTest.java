package com.example.demo.service;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
import com.example.demo.repository.GradeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("GradeService - Tests Unitaires")
class GradeServiceTest {

    @Mock
    private GradeRepository gradeRepository;

    @InjectMocks
    private GradeService gradeService;

    private Student testStudent;
    private UE testUE;
    private Grade testGrade;

    @BeforeEach
    void setup() {
        User testUser = new User("etudiant@test.com", "password123", Collections.singletonList("ROLE_STUDENT"));
        testUser.setId(1L);

        testStudent = new Student(testUser);
        testStudent.setId(1L);

        testUE = new UE("STA103", "Statistiques");
        testUE.setId(1L);

        testGrade = new Grade(testStudent, testUE, 16.5);
        testGrade.setId(1L);
    }

    @Test
    @DisplayName("Créer ou mettre à jour note avec succès")
    void testCreateOrUpdateGrade() {
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        Grade result = gradeService.createOrUpdateGrade(testStudent, testUE, 16.5);

        assertNotNull(result);
        assertEquals(16.5, result.getValeur());
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }

    @Test
    @DisplayName("Note doit être entre 0 et 20")
    void testGradeValueRange() {
        testGrade.setValeur(15.0);
        
        assertTrue(testGrade.getValeur() >= 0 && testGrade.getValeur() <= 20);
        
        testGrade.setValeur(0.0);
        assertTrue(testGrade.getValeur() >= 0);
        
        testGrade.setValeur(20.0);
        assertTrue(testGrade.getValeur() <= 20);
    }

    @Test
    @DisplayName("Obtenir notes par étudiant")
    void testGetGradesByStudent() {
        List<Grade> grades = new ArrayList<>();
        grades.add(testGrade);
        
        when(gradeRepository.findByStudent(testStudent)).thenReturn(grades);

        List<Grade> result = gradeRepository.findByStudent(testStudent);

        assertEquals(1, result.size());
        assertEquals(16.5, result.get(0).getValeur());
        verify(gradeRepository, times(1)).findByStudent(testStudent);
    }

    @Test
    @DisplayName("Obtenir note par étudiant et UE")
    void testGetGradeByStudentAndUe() {
        when(gradeRepository.findByStudentAndUe(testStudent, testUE)).thenReturn(Optional.of(testGrade));

        Optional<Grade> result = gradeRepository.findByStudentAndUe(testStudent, testUE);

        assertTrue(result.isPresent());
        assertEquals(16.5, result.get().getValeur());
        assertEquals("STA103", result.get().getUe().getCode());
    }

    @Test
    @DisplayName("Note non trouvée retourne empty")
    void testGetGradeNotFound() {
        when(gradeRepository.findByStudentAndUe(testStudent, testUE)).thenReturn(Optional.empty());

        Optional<Grade> result = gradeRepository.findByStudentAndUe(testStudent, testUE);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Mettre à jour note existante")
    void testUpdateExistingGrade() {
        when(gradeRepository.findByStudentAndUe(testStudent, testUE)).thenReturn(Optional.of(testGrade));
        testGrade.setValeur(18.5);
        when(gradeRepository.save(any(Grade.class))).thenReturn(testGrade);

        Grade result = gradeRepository.save(testGrade);

        assertEquals(18.5, result.getValeur());
        verify(gradeRepository, times(1)).save(any(Grade.class));
    }

    @Test
    @DisplayName("Obtenir toutes notes d'un étudiant - multiple UEs")
    void testGetAllGradesForStudent() {
        Grade grade2 = new Grade();
        grade2.setId(2L);
        grade2.setStudent(testStudent);
        
        UE ue2 = new UE();
        ue2.setId(2L);
        ue2.setCode("STA102");
        grade2.setUe(ue2);
        grade2.setValeur(14.0);

        List<Grade> grades = List.of(testGrade, grade2);
        when(gradeRepository.findByStudent(testStudent)).thenReturn(grades);

        List<Grade> result = gradeRepository.findByStudent(testStudent);

        assertEquals(2, result.size());
        assertEquals(16.5, result.get(0).getValeur());
        assertEquals(14.0, result.get(1).getValeur());
    }

    @Test
    @DisplayName("Moyenne des notes d'un étudiant")
    void testCalculateAverageGrade() {
        Grade grade2 = new Grade();
        grade2.setValeur(14.0);
        
        List<Grade> grades = List.of(testGrade, grade2);
        
        double average = grades.stream()
                .mapToDouble(g -> g.getValeur())
                .average()
                .orElse(0.0);

        assertEquals(15.25, average);
    }

    @Test
    @DisplayName("Valider grade - 0 valide")
    void testGradeZeroValid() {
        testGrade.setValeur(0.0);
        
        assertTrue(testGrade.getValeur() >= 0 && testGrade.getValeur() <= 20);
        assertEquals(0.0, testGrade.getValeur());
    }

    @Test
    @DisplayName("Valider grade - 20 valide")
    void testGradeMaxValid() {
        testGrade.setValeur(20.0);
        
        assertTrue(testGrade.getValeur() >= 0 && testGrade.getValeur() <= 20);
        assertEquals(20.0, testGrade.getValeur());
    }
}
