package com.example.demo.service;

import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.model.User;
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

    public StudentService(StudentRepository studentRepository, UERepository ueRepository) {
        this.studentRepository = studentRepository;
        this.ueRepository = ueRepository;
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
