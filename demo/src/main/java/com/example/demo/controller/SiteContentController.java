package com.example.demo.controller;

import com.example.demo.dto.SiteContentUpdateRequest;
import com.example.demo.service.SiteContentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
public class SiteContentController {

    private final SiteContentService siteContentService;

    public SiteContentController(SiteContentService siteContentService) {
        this.siteContentService = siteContentService;
    }

    @GetMapping("/{key}")
    public ResponseEntity<Map<String, String>> getContent(
            @PathVariable String key,
            @RequestParam(defaultValue = "") String defaultValue
    ) {
        String value = siteContentService.getContentValue(key, defaultValue);
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> updateContent(
            @PathVariable String key,
            @Valid @RequestBody SiteContentUpdateRequest request
    ) {
        String value = siteContentService.updateContentValue(key, request.getValue());
        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }
}
