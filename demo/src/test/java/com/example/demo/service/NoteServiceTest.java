package com.example.demo.service;

import com.example.demo.model.Note;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class NoteServiceTest {

    @Test
    void shouldCreateAndRetrieveNotes() {
        NoteService service = new NoteService();

        Note created = service.createNote("Titre", "Contenu");

        assertNotNull(created.getId());
        assertEquals("Titre", created.getTitle());
        assertEquals("Contenu", created.getContent());

        assertTrue(service.getAllNotes().size() >= 1);
        assertTrue(service.getNoteById(created.getId()).isPresent());
    }

    @Test
    void shouldDeleteExistingNote() {
        NoteService service = new NoteService();

        Note created = service.createNote("À supprimer", "Contenu");

        assertTrue(service.deleteNote(created.getId()));
        assertTrue(service.getNoteById(created.getId()).isEmpty());
    }
}
