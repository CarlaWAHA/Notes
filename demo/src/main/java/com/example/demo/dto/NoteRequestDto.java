package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO représentant la requête de création ou de modification d'une note.
 */
public class NoteRequestDto {

    /** Titre de la note. Ne doit pas être vide. */
    @NotBlank(message = "Le titre ne doit pas être vide")
    private String title;

    /** Contenu de la note. Ne doit pas être vide. */
    @NotBlank(message = "Le contenu ne doit pas être vide")
    private String content;

    public NoteRequestDto() {
    }

    public NoteRequestDto(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
