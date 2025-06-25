// src/main/java/com/trabweb/trabwebspring/service/EmailService.java
package com.trabweb.trabwebspring.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendAutoCadastroPassword(String to, String senha) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Sua senha de acesso");
        message.setText("Obrigado por se cadastrar! Sua senha de acesso é: " + senha);
        mailSender.send(message);
    }
}
