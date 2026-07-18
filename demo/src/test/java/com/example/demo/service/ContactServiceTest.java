package com.example.demo.service;

import com.example.demo.dto.ContactRequestDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class ContactServiceTest {

    private JavaMailSender mailSender;
    private ContactService contactService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        contactService = new ContactService(mailSender);
        ReflectionTestUtils.setField(contactService, "contactRecipient", "contact@trustcampus.org");
        ReflectionTestUtils.setField(contactService, "senderAddress", "no-reply@trustcampus.org");
    }

    @Test
    void shouldSendFormattedContactEmail() {
        ContactRequestDto request = new ContactRequestDto();
        request.setFullName("Jane Student");
        request.setEmail("jane@student.com");
        request.setSubject("Transfert ECTS");
        request.setMessage("Je souhaite reprendre mes UE.");

        contactService.sendContactMessage(request);

        ArgumentCaptor<SimpleMailMessage> messageCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender, times(1)).send(messageCaptor.capture());

        SimpleMailMessage message = messageCaptor.getValue();
        assertEquals("contact@trustcampus.org", message.getTo()[0]);
        assertEquals("no-reply@trustcampus.org", message.getFrom());
        assertEquals("jane@student.com", message.getReplyTo());
        assertEquals("[Trust Campus] Transfert ECTS", message.getSubject());
        assertTrue(message.getText().contains("Jane Student"));
    }
}
