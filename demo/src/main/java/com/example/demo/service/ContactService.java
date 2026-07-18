package com.example.demo.service;

import com.example.demo.dto.ContactRequestDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final JavaMailSender mailSender;

    @Value("${app.contact.recipient:contact@trustcampus.org}")
    private String contactRecipient;

    @Value("${spring.mail.username:no-reply@trustcampus.org}")
    private String senderAddress;

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactMessage(ContactRequestDto request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(contactRecipient);
        message.setFrom(senderAddress);
        message.setReplyTo(request.getEmail());
        message.setSubject("[Trust Campus] " + request.getSubject());
        message.setText(buildMessageBody(request));

        mailSender.send(message);
    }

    private String buildMessageBody(ContactRequestDto request) {
        return String.format(
                "Nouveau message du formulaire de contact Trust Campus%n%nNom: %s%nEmail: %s%nSujet: %s%n%nMessage:%n%s%n",
                request.getFullName(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage()
        );
    }
}
