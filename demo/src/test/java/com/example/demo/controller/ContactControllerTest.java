package com.example.demo.controller;

import com.example.demo.dto.ContactRequestDto;
import com.example.demo.service.ContactService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ContactControllerTest {

    @Mock
    private ContactService contactService;

    @InjectMocks
    private ContactController contactController;

    @Test
    void shouldAcceptContactMessage() {
        ContactRequestDto request = new ContactRequestDto();
        request.setFullName("Jane Student");
        request.setEmail("jane@student.com");
        request.setSubject("Info");
        request.setMessage("Bonjour");

        var response = contactController.sendContactMessage(request);

        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        verify(contactService, times(1)).sendContactMessage(request);
    }
}
