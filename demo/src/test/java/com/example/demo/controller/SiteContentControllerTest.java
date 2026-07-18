package com.example.demo.controller;

import com.example.demo.dto.SiteContentUpdateRequest;
import com.example.demo.service.SiteContentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SiteContentControllerTest {

    @Mock
    private SiteContentService siteContentService;

    @InjectMocks
    private SiteContentController siteContentController;

    @Test
    void shouldReturnStoredContentValue() {
        when(siteContentService.getContentValue("tc.home.hero", "Default")).thenReturn("Stored");

        var response = siteContentController.getContent("tc.home.hero", "Default");

        assertEquals("Stored", response.getBody().get("value"));
        verify(siteContentService, times(1)).getContentValue("tc.home.hero", "Default");
    }

    @Test
    void shouldUpdateContentValue() {
        SiteContentUpdateRequest request = new SiteContentUpdateRequest();
        request.setValue("Updated");
        when(siteContentService.updateContentValue("tc.home.hero", "Updated")).thenReturn("Updated");

        var response = siteContentController.updateContent("tc.home.hero", request);

        assertEquals("Updated", response.getBody().get("value"));
        verify(siteContentService, times(1)).updateContentValue("tc.home.hero", "Updated");
    }
}
