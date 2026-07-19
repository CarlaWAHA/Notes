package com.example.demo.controller;

import com.example.demo.model.UE;
import com.example.demo.repository.GradeRepository;
import com.example.demo.repository.StudentRepository;
import com.example.demo.repository.UERepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ues")
public class UEController {

    private final UERepository ueRepository;
    private final StudentRepository studentRepository;
    private final GradeRepository gradeRepository;

    public UEController(UERepository ueRepository, StudentRepository studentRepository, GradeRepository gradeRepository) {
        this.ueRepository = ueRepository;
        this.studentRepository = studentRepository;
        this.gradeRepository = gradeRepository;
        initializeDefaultUEs();
    }

    private void initializeDefaultUEs() {
        if (ueRepository.count() == 0) {
            ueRepository.save(new UE("STA103", "Calcul de Probabilité"));
            ueRepository.save(new UE("STA102", "Statistique"));
            ueRepository.save(new UE("STA101", "Algèbre"));
            ueRepository.save(new UE("STA100", "Analyse des science de l'ingénieure"));
        }
    }

    @GetMapping
    public ResponseEntity<List<UE>> getAllUEs() {
        return ResponseEntity.ok(ueRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UE> getUEById(@PathVariable Long id) {
        return ueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<UE> getUEByCode(@PathVariable String code) {
        return ueRepository.findByCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUE(@RequestBody UE request) {
        if (request.getCode() == null || request.getCode().isBlank() || request.getTitre() == null || request.getTitre().isBlank()) {
            return ResponseEntity.badRequest().body("Code and title are required");
        }

        Optional<UE> existing = ueRepository.findByCode(request.getCode().trim());
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body("UE code already exists");
        }

        UE saved = ueRepository.save(new UE(request.getCode().trim(), request.getTitre().trim()));
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUE(@PathVariable Long id, @RequestBody UE request) {
        Optional<UE> existingOpt = ueRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        if (request.getCode() == null || request.getCode().isBlank() || request.getTitre() == null || request.getTitre().isBlank()) {
            return ResponseEntity.badRequest().body("Code and title are required");
        }

        UE existing = existingOpt.get();
        Optional<UE> duplicate = ueRepository.findByCode(request.getCode().trim());
        if (duplicate.isPresent() && !duplicate.get().getId().equals(existing.getId())) {
            return ResponseEntity.badRequest().body("UE code already exists");
        }

        existing.setCode(request.getCode().trim());
        existing.setTitre(request.getTitre().trim());
        return ResponseEntity.ok(ueRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUE(@PathVariable Long id) {
        Optional<UE> ueOpt = ueRepository.findById(id);
        if (ueOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UE ue = ueOpt.get();
        // Detach UE from students before deletion to avoid FK constraint failures.
        studentRepository.findAll().forEach(student -> {
            student.removeUE(ue);
            studentRepository.save(student);
        });

        gradeRepository.deleteAll(gradeRepository.findByUe(ue));
        ueRepository.delete(ue);
        return ResponseEntity.noContent().build();
    }
}
