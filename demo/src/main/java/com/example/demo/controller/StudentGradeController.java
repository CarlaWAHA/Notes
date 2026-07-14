package com.example.demo.controller;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.service.GradeService;
import com.example.demo.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/student/grades")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
@PreAuthorize("hasRole('STUDENT')")
public class StudentGradeController {

    private final GradeService gradeService;
    private final StudentService studentService;

    public StudentGradeController(GradeService gradeService, StudentService studentService) {
        this.gradeService = gradeService;
        this.studentService = studentService;
    }

    @GetMapping("/my-grades")
    public ResponseEntity<?> getMyGrades(@RequestHeader("Authorization") String authHeader) {
        // This would normally get the current user from Spring Security
        // For now, we'll return a placeholder
        return ResponseEntity.ok("Please implement user context extraction");
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<?> getStudentGrades(@PathVariable Long studentId) {
        Optional<Student> student = studentService.findById(studentId);
        if (student.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<Grade> grades = gradeService.getGradesByStudent(student.get());
        return ResponseEntity.ok(grades);
    }
}
