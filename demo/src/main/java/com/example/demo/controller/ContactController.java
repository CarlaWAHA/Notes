package com.example.demo.controller;

import com.example.demo.dto.ContactRequestDto;
import com.example.demo.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"})
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Void> sendContactMessage(@Valid @RequestBody ContactRequestDto request) {
        contactService.sendContactMessage(request);
        return ResponseEntity.accepted().build();
    }
}
