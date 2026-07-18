package com.example.demo.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ContactRequestDto {

    @NotBlank(message = "Le nom complet est requis")
    @Size(max = 120, message = "Le nom complet ne doit pas depasser 120 caracteres")
    private String fullName;

    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit etre valide")
    @Size(max = 160, message = "L'email ne doit pas depasser 160 caracteres")
    private String email;

    @NotBlank(message = "Le sujet est requis")
    @Size(max = 180, message = "Le sujet ne doit pas depasser 180 caracteres")
    private String subject;

    @NotBlank(message = "Le message est requis")
    @Size(max = 5000, message = "Le message ne doit pas depasser 5000 caracteres")
    private String message;

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
