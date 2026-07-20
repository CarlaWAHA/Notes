package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
import com.example.demo.repository.GradeRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UERepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UERepository ueRepository;
    private final GradeRepository gradeRepository;

    public StudentService(StudentRepository studentRepository, UERepository ueRepository, GradeRepository gradeRepository) {
        this.studentRepository = studentRepository;
        this.ueRepository = ueRepository;
        this.gradeRepository = gradeRepository;
    }

    public Optional<Student> createStudent(User user, List<String> ueCodes) {
        return createStudent(user, ueCodes, List.of());
    }

    public Optional<Student> createStudent(User user, List<String> ueCodes, List<String> courseTitles) {
        Student student = new Student(user);
        
        for (String ueCode : ueCodes) {
            Optional<UE> ue = ueRepository.findByCode(ueCode);
            if (ue.isPresent()) {
                student.addUE(ue.get());
            }
        }

        for (String courseTitle : courseTitles) {
            student.addCourseTitle(courseTitle);
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

    public Optional<Student> replaceStudentUEs(Long studentId, List<String> ueCodes) {
        return replaceStudentAssignments(studentId, ueCodes, List.of());
    }

    public Optional<Student> replaceStudentAssignments(Long studentId, List<String> ueCodes, List<String> courseTitles) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return Optional.empty();
        }

        Student student = studentOpt.get();
        Set<UE> updatedUes = new java.util.HashSet<>();
        for (String ueCode : ueCodes) {
            ueRepository.findByCode(ueCode).ifPresent(updatedUes::add);
        }

        if (updatedUes.isEmpty()) {
            return Optional.empty();
        }

        student.setUes(updatedUes);
        Set<String> updatedCourseTitles = new java.util.HashSet<>();
        for (String courseTitle : courseTitles) {
            if (courseTitle != null && !courseTitle.isBlank()) {
                updatedCourseTitles.add(courseTitle.trim());
            }
        }
        student.setCourseTitles(updatedCourseTitles);
        return Optional.of(studentRepository.save(student));
    }

    public Optional<Student> findByUsername(String username) {
        return studentRepository.findByUserUsername(username);
    }

    public boolean deleteStudent(Long studentId) {
        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if (studentOpt.isEmpty()) {
            return false;
        }

        gradeRepository.deleteAll(gradeRepository.findByStudent(studentOpt.get()));
        studentRepository.delete(studentOpt.get());
        return true;
    }
}
