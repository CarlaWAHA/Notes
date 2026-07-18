package com.example.demo.repository;

import com.example.demo.model.SiteContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteContentRepository extends JpaRepository<SiteContent, Long> {
    Optional<SiteContent> findByContentKey(String contentKey);
}
