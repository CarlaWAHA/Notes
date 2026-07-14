package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO représentant la requête d'authentification.
 * Contient les identifiants fournis par l'utilisateur lors du login.
 */
public class AuthRequestDto {

    /** Nom d'utilisateur (adresse email). */
    @NotBlank(message = "Le nom d'utilisateur ne doit pas être vide")
    private String username;

    /** Mot de passe en clair (sera comparé au hash BCrypt). */
    @NotBlank(message = "Le mot de passe ne doit pas être vide")
    private String password;

    public AuthRequestDto() {
    }

    public AuthRequestDto(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
