package com.example.demo.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Table(name = "Transaktionen") // Der Tabellenname muss deiner tatsächlichen Tabelle entsprechen
public class Transaktion {

    @Id
    @Column(name = "TransaktionsID")
    private int transaktionsID;

    @Column(name = "ISIN")
    private String isin;

    @Column(name = "Betrag")
    private double betrag;

    @Column(name = "Zeitstempel")
    private Timestamp zeitstempel;

    @Column(name = "Anzahl")
    private int anzahl;

    @Column(name = "Typ")
    private String typ;

    @Column(name = "DepotID")
    private int depotID;

    // Konstruktoren
    public Transaktion() {
        // Für Hibernate benötigt
    }

    public Transaktion(String isin, double betrag, int anzahl, String typ, int depotID) {
        this.isin = isin;
        this.betrag = betrag;
        this.typ = typ;
        this.depotID = depotID;
        this.anzahl = anzahl;
        // Zeitstempel auf die aktuelle Zeit setzen
        this.zeitstempel = new Timestamp(new Date().getTime());
    }

    // Getters und Setters
    public int getTransaktionsID() {
        return transaktionsID;
    }

    public String getISIN() {
        return isin;
    }

    public void setISIN(String isin) {
        this.isin = isin;
    }

    public double getBetrag() {
        return betrag;
    }

    public void setBetrag(double betrag) {
        this.betrag = betrag;
    }

    public Timestamp getZeitstempel() {
        return zeitstempel;
    }

    public void setZeitstempel(Timestamp zeitstempel) {
        this.zeitstempel = zeitstempel;
    }

    public int getAnzahl() {
        return anzahl;
    }

    public void setAnzahl(int anzahl) {
        this.anzahl = anzahl;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public int getDepotID() {
        return depotID;
    }

    public void setDepotID(int depotID) {
        this.depotID = depotID;
    }

   
    @Override
    public String toString() {
        return "Transaktion{" +
                "transaktionsID=" + transaktionsID +
                ", isin='" + isin + '\'' +
                ", betrag=" + betrag +
                ", zeitstempel=" + zeitstempel +
                ", anzahl=" + anzahl +
                ", typ='" + typ + '\'' +
                ", depotID=" + depotID +
                '}';
    }

    public void printTransactionDetails() {
        System.out.println("Transaktionsdetails:");
        System.out.println("Transaktions-ID: " + transaktionsID);
        System.out.println("ISIN: " + isin);
        System.out.println("Betrag: " + betrag);
        System.out.println("Zeitstempel: " + zeitstempel);
        System.out.println("Anzahl: " + anzahl);
        System.out.println("Typ: " + typ);
        System.out.println();
    }
    

    
}

