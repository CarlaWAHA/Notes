package com.example.demo.service;

import com.example.demo.model.Note;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NoteService {
    private final List<Note> notes = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public List<Note> getAllNotes() {
        return new ArrayList<>(notes);
    }

    public Optional<Note> getNoteById(Long id) {
        return notes.stream().filter(note -> note.getId().equals(id)).findFirst();
    }

    public Note createNote(String title, String content) {
        Note note = new Note(idGenerator.getAndIncrement(), title, content);
        notes.add(note);
        return note;
    }

    public boolean deleteNote(Long id) {
        return notes.removeIf(note -> note.getId().equals(id));
    }
}
