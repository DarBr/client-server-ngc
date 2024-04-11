package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "User")
public class Nutzer {
    @Id
    @GeneratedValue
    private int UserId;
    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;
    @Column(name = "DepotID")
    private int depotID;
    @Column(name = "KontoID")
    private int kontoID;

    // Constructor
    public Nutzer(String username, String password) {
        this.username = username;
        this.password = password;

    }

    public Nutzer() {

    }

    public void setId(int id) {
        this.UserId = id;
    }

    public int getId() {
        return UserId;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getDepotID() {
        return depotID;
    }

    public void setDepotID(int depotID) {
        this.depotID = depotID;
    }

    public int getKontoID() {
        return kontoID;
    }

    public void setKontoID(int kontoID) {
        this.kontoID = kontoID;
    }

    public void displayUser() {
        System.out.println("Benutzername: " + this.getUsername());
        System.out.println("Passwort: " + this.getPassword());
        System.out.println("DepotID: " + this.getDepotID());
        System.out.println("KontoID: " + this.getKontoID());

    }
}