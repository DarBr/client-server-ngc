package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Depot {

    @Id
    @Column(name = "DepotAktienID")
    private int DepotAktienID;
    @Column(name = "DepotID")
    private int DepotID;
    @Column(name = "ISIN")
    private String ISIN;
    @Column(name = "Anzahl")
    private int Anzahl;

    public Depot() {

    }

    public Depot(int DepotID, String ISIN, int Anzahl) {
        this.DepotID = DepotID;
        this.ISIN = ISIN;
        this.Anzahl = Anzahl;
    }

    public int getDepotAktienID() {
        return DepotAktienID;
    }

    public void setDepotAktienID(int DepotAktienID) {
        this.DepotAktienID = DepotAktienID;
    }

    public int getDepotID() {
        return DepotID;
    }

    public void setDepotID(int DepotID) {
        this.DepotID = DepotID;
    }

    public String getISIN() {
        return ISIN;
    }

    public void setISIN(String ISIN) {
        this.ISIN = ISIN;
    }

    public int getAnzahl() {
        return Anzahl;
    }

    public void setAnzahl(int Anzahl) {
        this.Anzahl = Anzahl;
    }

    public void kaufen(String ISIN, int Anzahl) {
        this.ISIN = ISIN;
        this.Anzahl = Anzahl;
    }

    public void displayDepot() {
        System.out.println("DepotAktienID: " + DepotAktienID);
        System.out.println("DepotID: " + DepotID);
        System.out.println("ISIN: " + ISIN);
        System.out.println("Anzahl: " + Anzahl);
    }

}
