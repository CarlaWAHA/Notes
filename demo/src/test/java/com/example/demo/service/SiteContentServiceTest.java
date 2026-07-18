package com.example.demo.service;

import com.example.demo.model.SiteContent;
import com.example.demo.repository.SiteContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SiteContentServiceTest {

    @Mock
    private SiteContentRepository siteContentRepository;

    @InjectMocks
    private SiteContentService siteContentService;

    private SiteContent siteContent;

    @BeforeEach
    void setUp() {
        siteContent = new SiteContent("tc.home.hero", "Stored content");
        siteContent.setId(1L);
    }

    @Test
    void shouldReturnStoredValueWhenPresent() {
        when(siteContentRepository.findByContentKey("tc.home.hero")).thenReturn(Optional.of(siteContent));

        String value = siteContentService.getContentValue("tc.home.hero", "Default");

        assertEquals("Stored content", value);
    }

    @Test
    void shouldReturnDefaultWhenMissing() {
        when(siteContentRepository.findByContentKey("missing")).thenReturn(Optional.empty());

        String value = siteContentService.getContentValue("missing", "Default");

        assertEquals("Default", value);
    }

    @Test
    void shouldCreateOrUpdateContent() {
        when(siteContentRepository.findByContentKey("tc.home.hero")).thenReturn(Optional.of(siteContent));
        when(siteContentRepository.save(any(SiteContent.class))).thenAnswer(invocation -> invocation.getArgument(0));

        String value = siteContentService.updateContentValue("tc.home.hero", "Updated content");

        assertEquals("Updated content", value);
        verify(siteContentRepository).save(any(SiteContent.class));
    }
}
