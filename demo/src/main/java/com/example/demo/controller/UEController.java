package com.example.demo.controller;

import com.example.demo.model.UE;
import com.example.demo.repository.UERepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ues")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class UEController {

    private final UERepository ueRepository;

    public UEController(UERepository ueRepository) {
        this.ueRepository = ueRepository;
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
}
