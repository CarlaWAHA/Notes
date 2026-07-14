package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ues")
public class UE {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String code;

    @Column(nullable = false)
    private String titre;

    protected UE() {
        // Required by JPA
    }

    public UE(Long id, String code, String titre) {
        this.id = id;
        this.code = code;
        this.titre = titre;
    }

    public UE(String code, String titre) {
        this.code = code;
        this.titre = titre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }
}
