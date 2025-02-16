package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_snapshot")
public class PortfolioSnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Zeitpunkt des Snapshots, z. B. täglich zur gleichen Uhrzeit
    private LocalDateTime snapshotTime;

    // Der berechnete Portfoliowert zu diesem Zeitpunkt
    private double portfolioValue;

    private int depotId;


    // Standard-Konstruktor (wichtig für JPA)
    public PortfolioSnapshot() {
    }


    public PortfolioSnapshot(LocalDateTime snapshotTime, double portfolioValue, int depotId) {
        this.snapshotTime = snapshotTime;
        this.portfolioValue = portfolioValue;
        this.depotId = depotId;
    }


    public Long getId() {
        return id;
    }

    public LocalDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public void setSnapshotTime(LocalDateTime snapshotTime) {
        this.snapshotTime = snapshotTime;
    }

    public double getPortfolioValue() {
        return portfolioValue;
    }

    public void setPortfolioValue(double portfolioValue) {
        this.portfolioValue = portfolioValue;
    }

    public int getDepotId() {
        return depotId;
    }

    public void setDepotId(int depotId) {
        this.depotId = depotId;
    }
}

