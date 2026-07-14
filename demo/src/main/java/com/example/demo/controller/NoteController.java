package com.example.demo.controller;

import com.example.demo.dto.NoteRequestDto;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Note;
import com.example.demo.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/notes")
@CrossOrigin(origins = "http://localhost:4200")
@Validated
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNoteById(@PathVariable Long id) {
        Note note = noteService.getNoteById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Note introuvable avec l'id " + id));
        return ResponseEntity.ok(note);
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@Valid @RequestBody NoteRequestDto noteRequest) {
        Note created = noteService.createNote(noteRequest.getTitle(), noteRequest.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        boolean deleted = noteService.deleteNote(id);
        if (!deleted) {
            throw new ResourceNotFoundException("Note introuvable avec l'id " + id);
        }
        return ResponseEntity.noContent().build();
    }
}
