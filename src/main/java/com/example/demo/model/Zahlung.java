package com.example.demo.model;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Zahlungen")
public class Zahlung {
    @Id
    @GeneratedValue
    @Column(name = "ZahlungsID")
    private int id;
    @Column(name = "Betrag")
    private double betrag;
    @Column(name = "Zeitstempel")
    private Timestamp zeitpunkt;
    @Column(name = "Typ")
    private String typ;
    @Column(name = "KontoID")
    private int kontoID;

    public Zahlung() {
        // Für Hibernate benötigt
    }

    public Zahlung(double betrag, String typ, int kontoID) {
        this.betrag = betrag;
        this.typ = typ;
        this.kontoID = kontoID;
        this.zeitpunkt = new Timestamp(System.currentTimeMillis());
    }

    public int getId() {
        return id;
    }

    public double getBetrag() {
        return betrag;
    }

    public void setBetrag(double betrag) {
        this.betrag = betrag;
    }

    public Timestamp getZeitpunkt() {
        return zeitpunkt;
    }

    public void setZeitpunkt(Timestamp zeitpunkt) {
        this.zeitpunkt = zeitpunkt;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public int getKontoID() {
        return kontoID;
    }

    public void setKontoID(int kontoID) {
        this.kontoID = kontoID;
    }

    public void printZahlungsdetails() {
        System.out.println("Zahlungsdetails:");
        System.out.println("ZahlungsID: " + id);
        System.out.println("Betrag: " + betrag);
        System.out.println("Zeitpunkt: " + zeitpunkt);
        System.out.println("Typ: " + typ);
        System.out.println();
        
    }


    
}
