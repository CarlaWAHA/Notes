package com.example.demo.repository;

import com.example.demo.model.Grade;
import com.example.demo.model.Student;
import com.example.demo.model.UE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudent(Student student);
    Optional<Grade> findByStudentAndUe(Student student, UE ue);
    void deleteByStudent(Student student);
    void deleteByUe(UE ue);
}
