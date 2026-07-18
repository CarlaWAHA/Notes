package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SiteContentUpdateRequest {

    @NotBlank(message = "La valeur est requise")
    @Size(max = 10000, message = "La valeur ne doit pas depasser 10000 caracteres")
    private String value;

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
