package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Konto")
public class Konto {

    @Id
    @GeneratedValue()
    @Column(name = "KontoID")
    private int kontoID;
    @Column(name = "Kontostand")
    private double kontostand;

    public Konto(int id, double kontostand) {
        this.kontoID = id;
        this.kontostand = kontostand;
    }

    public Konto() {

    }

    public double getKontostand() {
        return kontostand;
    }

    public void setKontostand(double kontostand) {
        this.kontostand = kontostand;
    }

    public int getKontoID() {
        return kontoID;
    }

    public void setKontoID(int kontoID) {
        this.kontoID = kontoID;
    }

}
