package com.example.demo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;

@Service
public class PriceService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Hardcoded API Key – für Testzwecke in Ordnung, aber in Produktion besser nicht so!
    private final String apiKey = "co5rfg9r01qv77g7nk90co5rfg9r01qv77g7nk9g";

    /**
     * Ruft den aktuellen Aktienpreis für das angegebene Symbol ab.
     *
     * @param symbol Das Aktiensymbol (z.B. "AMZN")
     * @return Der aktuelle Preis, gerundet auf zwei Nachkommastellen.
     * @throws IOException, falls der Abruf oder das Parsen fehlschlägt.
     */
    public double getCurrentPrice(String symbol) throws IOException {
        String url = "https://finnhub.io/api/v1/quote?symbol=" + symbol + "&token=" + apiKey;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        
        if (response.getStatusCode().is2xxSuccessful()) {
            String body = response.getBody();
            JsonNode root = objectMapper.readTree(body);
            double currentPrice = root.get("c").asDouble();  // "c" steht für den aktuellen Preis
            return Math.round(currentPrice * 100.0) / 100.0;
        } else {
            throw new IOException("Fehler beim Abrufen des Preises. HTTP-Status: " + response.getStatusCode());
        }
    }
}
