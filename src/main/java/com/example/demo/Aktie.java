package com.example.demo;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.springframework.boot.jackson.JsonObjectSerializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;





public class Aktie {
    private String name;
    private double einstandspreis;

    public Aktie(String name, double einstandspreis) {
        this.name = name;

        this.einstandspreis = einstandspreis;
    }

    public Aktie(String name) {
        this.name = name;

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getEinstandspreis() {
        return einstandspreis;
    }

    public void setEinstandspreis(double einstandspreis) {
        this.einstandspreis = einstandspreis;
    }

    public double getAktienpreis() throws IOException {
        String apiKey = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";
        String symbol = this.name;
        // Finnhub API-Endpunkt-URL für den aktuellen Aktienpreis
        String apiUrl = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + apiKey;

        // Verbindung zur API herstellen
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        // Überprüfen des HTTP-Statuscodes
        int responseCode = conn.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            // Antwort lesen
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                StringBuilder response = new StringBuilder();
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }

                // ...

                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonResponse = objectMapper.readTree(response.toString());
                double stockPrice = jsonResponse.get("c").asDouble();
                double roundedStockPrice = Math.round(stockPrice * 100.0) / 100.0;
                return roundedStockPrice;

            }
        } else {
            // Fehlerbehandlung für nicht erfolgreiche API-Anfrage
            throw new IOException("Fehler beim Abrufen des Aktienpreises. HTTP-Statuscode: " + responseCode);
        }
    }

    public static void main(String[] args) throws IOException {
        // Existing code...
        Aktie aktie = new Aktie("AMZN");
        double price = aktie.getAktienpreis();
        System.err.println("Preis der Aktie " + aktie.getName() + ": " + price);

        // Rest of the code...
    }
}