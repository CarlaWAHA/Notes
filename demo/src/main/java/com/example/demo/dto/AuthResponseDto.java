package com.example.demo.dto;

import java.util.List;

/**
 * DTO représentant la réponse après une authentification réussie.
 * Retourné au frontend avec le token, les rôles et les infos de l'utilisateur.
 */
public class AuthResponseDto {

    /** Token Bearer à inclure dans les requêtes authentifiées (Authorization: Bearer <token>). */
    private String token;

    /** Liste des rôles de l'utilisateur (ex. ROLE_ADMIN, ROLE_STUDENT). */
    private List<String> roles;

    /** Identifiant technique de l'utilisateur en base. */
    private Long userId;

    /** Nom d'utilisateur (adresse email). */
    private String username;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, List<String> roles, Long userId, String username) {
        this.token = token;
        this.roles = roles;
        this.userId = userId;
        this.username = username;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
