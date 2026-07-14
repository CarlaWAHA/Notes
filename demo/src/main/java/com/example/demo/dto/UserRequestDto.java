package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO représentant la requête de création d'un compte étudiant.
 * Utilisé par l'administrateur pour enregistrer un nouvel étudiant.
 */
public class UserRequestDto {

    /** Adresse email de l'étudiant (utilisée comme identifiant de connexion). */
    @Email(message = "L'adresse email doit être valide")
    @NotBlank(message = "L'email est requis")
    private String username;

    /** Mot de passe initial de l'étudiant (sera encodé en BCrypt). */
    @NotBlank(message = "Le mot de passe est requis")
    private String password;

    public UserRequestDto() {
    }

    public UserRequestDto(String username, String password) {
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
