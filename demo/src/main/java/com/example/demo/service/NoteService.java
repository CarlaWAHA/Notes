package com.example.demo.service;

import com.example.demo.model.Note;
import com.example.demo.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NoteService {
    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Note> getNoteById(Long id) {
        return noteRepository.findById(id);
    }

    public Note createNote(String title, String content) {
        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        return noteRepository.save(note);
    }

    public Optional<Note> updateNote(Long id, String title, String content) {
        Optional<Note> existing = getNoteById(id);
        if (existing.isEmpty()) {
            return Optional.empty();
        }

        Note note = existing.get();
        note.setTitle(title);
        note.setContent(content);
        return Optional.of(noteRepository.save(note));
    }

    public boolean deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            return false;
        }

        noteRepository.deleteById(id);
        return true;
    }
}
