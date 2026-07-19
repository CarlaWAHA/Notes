package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
import com.example.demo.repository.GradeRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UERepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UERepository ueRepository;
    private final UserRepository userRepository;
    private final GradeRepository gradeRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(
            StudentRepository studentRepository,
            UERepository ueRepository,
            UserRepository userRepository,
            GradeRepository gradeRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.studentRepository = studentRepository;
        this.ueRepository = ueRepository;
        this.userRepository = userRepository;
        this.gradeRepository = gradeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Student> createStudent(User user, List<String> ueCodes) {
        Student student = new Student(user);
        
        for (String ueCode : ueCodes) {
            Optional<UE> ue = ueRepository.findByCode(ueCode);
            if (ue.isPresent()) {
                student.addUE(ue.get());
            }
        }
        
        Student savedStudent = studentRepository.save(student);
        return Optional.of(savedStudent);
    }

    public Optional<Student> findByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> updateStudent(Long id, String username, String rawPassword, List<String> ueCodes) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isEmpty()) {
            return Optional.empty();
        }

        Student student = studentOptional.get();
        User user = student.getUser();

        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Student with this username already exists");
        }

        user.setUsername(username);
        if (rawPassword != null && !rawPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(rawPassword));
        }

        student.setUes(new HashSet<>());
        for (String ueCode : ueCodes) {
            ueRepository.findByCode(ueCode).ifPresent(student::addUE);
        }

        return Optional.of(studentRepository.save(student));
    }

    public boolean deleteStudent(Long id) {
        Optional<Student> studentOptional = studentRepository.findById(id);
        if (studentOptional.isEmpty()) {
            return false;
        }

        Student student = studentOptional.get();
        gradeRepository.deleteByStudent(student);
        studentRepository.delete(student);
        return true;
    }

    public Optional<Student> addUEToStudent(Long studentId, String ueCode) {
        Optional<Student> student = studentRepository.findById(studentId);
        Optional<UE> ue = ueRepository.findByCode(ueCode);
        
        if (student.isPresent() && ue.isPresent()) {
            student.get().addUE(ue.get());
            return Optional.of(studentRepository.save(student.get()));
        }
        
        return Optional.empty();
    }

    public Optional<Student> removeUEFromStudent(Long studentId, String ueCode) {
        Optional<Student> student = studentRepository.findById(studentId);
        Optional<UE> ue = ueRepository.findByCode(ueCode);
        
        if (student.isPresent() && ue.isPresent()) {
            student.get().removeUE(ue.get());
            return Optional.of(studentRepository.save(student.get()));
        }
        
        return Optional.empty();
    }
}
