package com.example.demo.repository;

import com.example.demo.model.UE;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UERepository extends JpaRepository<UE, Long> {
    Optional<UE> findByCode(String code);
}
