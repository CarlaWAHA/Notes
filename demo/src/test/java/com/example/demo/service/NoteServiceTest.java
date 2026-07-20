package com.example.demo.service;

import com.example.demo.model.Note;
import com.example.demo.repository.NoteRepository;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.*;

class NoteServiceTest {

    private NoteService createService(List<Note> storage) {
        NoteRepository noteRepository = mock(NoteRepository.class);

        when(noteRepository.findAll()).thenAnswer(invocation -> new ArrayList<>(storage));
        when(noteRepository.findById(any())).thenAnswer(invocation -> {
            Long id = invocation.getArgument(0);
            return storage.stream().filter(note -> note.getId().equals(id)).findFirst();
        });
        when(noteRepository.existsById(any())).thenAnswer(invocation -> {
            Long id = invocation.getArgument(0);
            return storage.stream().anyMatch(note -> note.getId().equals(id));
        });
        when(noteRepository.save(any(Note.class))).thenAnswer(invocation -> {
            Note note = invocation.getArgument(0);
            if (note.getId() == null) {
                note.setId((long) storage.size() + 1);
            }

            storage.removeIf(existing -> existing.getId().equals(note.getId()));
            storage.add(note);
            return note;
        });
        doAnswer(invocation -> {
            Long id = invocation.getArgument(0);
            storage.removeIf(note -> note.getId().equals(id));
            return null;
        }).when(noteRepository).deleteById(any());

        return new NoteService(noteRepository);
    }

    @Test
    void shouldCreateAndRetrieveNotes() {
        NoteService service = createService(new ArrayList<>());

        Note created = service.createNote("Titre", "Contenu");

        assertNotNull(created.getId());
        assertEquals("Titre", created.getTitle());
        assertEquals("Contenu", created.getContent());

        assertTrue(service.getAllNotes().size() >= 1);
        assertTrue(service.getNoteById(created.getId()).isPresent());
    }

    @Test
    void shouldDeleteExistingNote() {
        NoteService service = createService(new ArrayList<>());

        Note created = service.createNote("À supprimer", "Contenu");

        assertTrue(service.deleteNote(created.getId()));
        assertTrue(service.getNoteById(created.getId()).isEmpty());
    }

    @Test
    void shouldUpdateExistingNote() {
        NoteService service = createService(new ArrayList<>());

        Note created = service.createNote("Titre", "Contenu");
        Note updated = service.updateNote(created.getId(), "Nouveau titre", "Nouveau contenu").orElseThrow();

        assertEquals("Nouveau titre", updated.getTitle());
        assertEquals("Nouveau contenu", updated.getContent());
    }
}
