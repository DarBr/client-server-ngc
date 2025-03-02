package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_history")
public class LoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int nutzerId;

    private LocalDateTime loginTimestamp;

    // Standard-Konstruktor, Getter und Setter
    public LoginHistory() {}

    public LoginHistory(int nutzerId, LocalDateTime loginTimestamp) {
        this.nutzerId = nutzerId;
        this.loginTimestamp = loginTimestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNutzerId() {
        return nutzerId;
    }

    public void setNutzerId(int nutzerId) {
        this.nutzerId = nutzerId;
    }

    public LocalDateTime getLoginTimestamp() {
        return loginTimestamp;
    }

    public void setLoginTimestamp(LocalDateTime loginTimestamp) {
        this.loginTimestamp = loginTimestamp;
    }
}
