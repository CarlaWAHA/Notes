package com.example.demo.controller;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.repository.UERepository;
import com.example.demo.service.GradeService;
import com.example.demo.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/admin/grades")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGradeController {

    private final GradeService gradeService;
    private final StudentService studentService;
    private final UERepository ueRepository;

    public AdminGradeController(GradeService gradeService, StudentService studentService, UERepository ueRepository) {
        this.gradeService = gradeService;
        this.studentService = studentService;
        this.ueRepository = ueRepository;
    }

    @PostMapping
    public ResponseEntity<?> createOrUpdateGrade(@RequestBody CreateGradeRequest request) {
        if (request.getStudentId() == null || request.getUeCode() == null || request.getValeur() == null) {
            return ResponseEntity.badRequest().body("Student ID, UE code, and valeur are required");
        }

        Optional<Student> student = studentService.findById(request.getStudentId());
        Optional<UE> ue = ueRepository.findByCode(request.getUeCode());

        if (student.isEmpty() || ue.isEmpty()) {
            return ResponseEntity.badRequest().body("Student or UE not found");
        }

        Grade grade = gradeService.createOrUpdateGrade(student.get(), ue.get(), request.getValeur());
        return ResponseEntity.status(HttpStatus.CREATED).body(grade);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getStudentGrades(@PathVariable Long studentId) {
        Optional<Student> student = studentService.findById(studentId);
        if (student.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(gradeService.getGradesByStudent(student.get()));
    }

    public static class CreateGradeRequest {
        private Long studentId;
        private String ueCode;
        private Double valeur;

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }

        public String getUeCode() {
            return ueCode;
        }

        public void setUeCode(String ueCode) {
            this.ueCode = ueCode;
        }

        public Double getValeur() {
            return valeur;
        }

        public void setValeur(Double valeur) {
            this.valeur = valeur;
        }
    }
}
