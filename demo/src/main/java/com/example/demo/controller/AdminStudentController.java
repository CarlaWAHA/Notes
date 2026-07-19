package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.model.User;
import com.example.demo.service.StudentService;
import com.example.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/students")
@PreAuthorize("hasRole('ADMIN')")
public class AdminStudentController {

    private final StudentService studentService;
    private final UserService userService;

    public AdminStudentController(StudentService studentService, UserService userService) {
        this.studentService = studentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody CreateStudentRequest request) {
        String username = request.getUsername() == null ? "" : request.getUsername().trim();
        String password = request.getPassword() == null ? "" : request.getPassword().trim();

        if (username.isBlank() ||
            password.isBlank() ||
            request.getUeCodes() == null || request.getUeCodes().isEmpty()) {
            return ResponseEntity.badRequest().body("Username, password, and at least one UE are required");
        }

        Optional<User> createdUser = userService.createStudent(username, password);
        if (createdUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Student username is invalid or already exists");
        }

        Optional<Student> createdStudent = studentService.createStudent(createdUser.get(), request.getUeCodes());
        if (createdStudent.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create student");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(createdStudent.get());
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        return studentService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody UpdateStudentRequest request) {
        Optional<Student> existingStudent = studentService.findById(id);
        if (existingStudent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (request.getUsername() == null || request.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        if (request.getUeCodes() == null || request.getUeCodes().isEmpty()) {
            return ResponseEntity.badRequest().body("At least one UE is required");
        }

        Optional<User> updatedUser = userService.updateStudentAccount(
            existingStudent.get().getUser().getId(),
            request.getUsername(),
            request.getPassword()
        );

        if (updatedUser.isEmpty()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        Optional<Student> updatedStudent = studentService.replaceStudentUEs(id, request.getUeCodes());
        return updatedStudent
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.badRequest().body("Unable to update student UEs"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (studentService.deleteStudent(id)) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{studentId}/ues/{ueCode}")
    public ResponseEntity<Student> addUEToStudent(@PathVariable Long studentId, @PathVariable String ueCode) {
        return studentService.addUEToStudent(studentId, ueCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{studentId}/ues/{ueCode}")
    public ResponseEntity<Student> removeUEFromStudent(@PathVariable Long studentId, @PathVariable String ueCode) {
        return studentService.removeUEFromStudent(studentId, ueCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    public static class CreateStudentRequest {
        private String username;
        private String password;
        private List<String> ueCodes;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public List<String> getUeCodes() {
            return ueCodes;
        }

        public void setUeCodes(List<String> ueCodes) {
            this.ueCodes = ueCodes;
        }
    }

    public static class UpdateStudentRequest {
        private String username;
        private String password;
        private List<String> ueCodes;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public List<String> getUeCodes() {
            return ueCodes;
        }

        public void setUeCodes(List<String> ueCodes) {
            this.ueCodes = ueCodes;
        }
    }
}
