package com.example.demo.service;

import com.example.demo.model.SiteContent;
import com.example.demo.repository.SiteContentRepository;
import org.springframework.stereotype.Service;

@Service
public class SiteContentService {

    private final SiteContentRepository siteContentRepository;

    public SiteContentService(SiteContentRepository siteContentRepository) {
        this.siteContentRepository = siteContentRepository;
    }

    public String getContentValue(String key, String defaultValue) {
        return siteContentRepository.findByContentKey(key)
                .map(SiteContent::getContentValue)
                .orElse(defaultValue);
    }

    public String updateContentValue(String key, String value) {
        SiteContent content = siteContentRepository.findByContentKey(key)
                .orElseGet(() -> new SiteContent(key, value));

        content.setContentValue(value);
        return siteContentRepository.save(content).getContentValue();
    }
}
