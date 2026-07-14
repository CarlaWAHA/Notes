package com.example.demo.service;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.model.UE;
import com.example.demo.repository.GradeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository gradeRepository) {
        this.gradeRepository = gradeRepository;
    }

    public Grade createOrUpdateGrade(Student student, UE ue, Double valeur) {
        Optional<Grade> existingGrade = gradeRepository.findByStudentAndUe(student, ue);
        
        if (existingGrade.isPresent()) {
            Grade grade = existingGrade.get();
            grade.setValeur(valeur);
            return gradeRepository.save(grade);
        }
        
        Grade newGrade = new Grade(student, ue, valeur);
        return gradeRepository.save(newGrade);
    }

    public List<Grade> getGradesByStudent(Student student) {
        return gradeRepository.findByStudent(student);
    }

    public Optional<Grade> getGradeByStudentAndUe(Student student, UE ue) {
        return gradeRepository.findByStudentAndUe(student, ue);
    }

    public Optional<Grade> findById(Long id) {
        return gradeRepository.findById(id);
    }
}
