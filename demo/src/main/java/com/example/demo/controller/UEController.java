package com.example.demo.controller;

import com.example.demo.model.UE;
import com.example.demo.repository.UERepository;
import com.example.demo.repository.GradeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ues")
public class UEController {

    private final UERepository ueRepository;
    private final GradeRepository gradeRepository;

    public UEController(UERepository ueRepository, GradeRepository gradeRepository) {
        this.ueRepository = ueRepository;
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
    public ResponseEntity<?> createUE(@RequestBody UERequest request) {
        if (request.getCode() == null || request.getCode().isBlank() || request.getTitre() == null || request.getTitre().isBlank()) {
            return ResponseEntity.badRequest().body("Code and title are required");
        }

        if (ueRepository.findByCode(request.getCode()).isPresent()) {
            return ResponseEntity.badRequest().body("UE with this code already exists");
        }

        UE ue = new UE(request.getCode(), request.getTitre());
        return ResponseEntity.status(HttpStatus.CREATED).body(ueRepository.save(ue));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUE(@PathVariable Long id, @RequestBody UERequest request) {
        if (request.getCode() == null || request.getCode().isBlank() || request.getTitre() == null || request.getTitre().isBlank()) {
            return ResponseEntity.badRequest().body("Code and title are required");
        }

        Optional<UE> existingOptional = ueRepository.findById(id);
        if (existingOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UE existing = existingOptional.get();
        Optional<UE> ueWithSameCode = ueRepository.findByCode(request.getCode());
        if (ueWithSameCode.isPresent() && !ueWithSameCode.get().getId().equals(existing.getId())) {
            return ResponseEntity.badRequest().body("UE with this code already exists");
        }

        existing.setCode(request.getCode());
        existing.setTitre(request.getTitre());
        return ResponseEntity.ok(ueRepository.save(existing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUE(@PathVariable Long id) {
        Optional<UE> ueOptional = ueRepository.findById(id);
        if (ueOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UE ue = ueOptional.get();
        gradeRepository.deleteByUe(ue);
        ueRepository.delete(ue);
        return ResponseEntity.noContent().build();
    }

    public static class UERequest {
        private String code;
        private String titre;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getTitre() {
            return titre;
        }

        public void setTitre(String titre) {
            this.titre = titre;
        }
    }
}
