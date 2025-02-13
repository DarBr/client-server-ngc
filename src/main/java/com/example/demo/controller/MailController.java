package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.MailService;

@RestController
@CrossOrigin("*")
@RequestMapping("/mail")
public class MailController {
    
    @Autowired
    private MailService mailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestParam String to,
                                            @RequestParam String subject,
                                            @RequestParam String text) {
        mailService.sendEmail(to, subject, text);
        return ResponseEntity.ok("E-Mail wurde erfolgreich gesendet!");
    }

}
