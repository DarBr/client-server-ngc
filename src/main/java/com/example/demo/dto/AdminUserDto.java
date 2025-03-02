package com.example.demo.dto;

public class AdminUserDto {
    private int id;
    private String username;
    private int depotID;
    private double portfolioValue;
    private int kontoID;

    public AdminUserDto(int id, String username, int depotID, double portfolioValue) {
        this.id = id;
        this.username = username;
        this.depotID = depotID;
        this.portfolioValue = portfolioValue;
    }

    // Getter & Setter
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public int getDepotID() {
        return depotID;
    }
    public void setDepotID(int depotID) {
        this.depotID = depotID;
    }
    public double getPortfolioValue() {
        return portfolioValue;
    }
    public void setPortfolioValue(double portfolioValue) {
        this.portfolioValue = portfolioValue;
    }
    public int getKontoID() {
        return kontoID;
    }
    public void setKontoID(int kontoID) {
        this.kontoID = kontoID;
    }
}
