package com.example.demo.repository;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.model.UE;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudent(Student student);
    List<Grade> findByUe(UE ue);
    Optional<Grade> findByStudentAndUe(Student student, UE ue);
}
