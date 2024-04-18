package com.example.demo.service;

import com.example.demo.Aktie;
import com.example.demo.model.Depot;
import com.example.demo.model.Konto;
import com.example.demo.model.Nutzer;
import com.example.demo.model.Transaktion;
import com.example.demo.repository.DepotRepository;
import com.example.demo.repository.KontoRepository;
import com.example.demo.repository.NutzerRepository;
import com.example.demo.repository.TransaktionRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class DepotService {
    @Autowired
    private DepotRepository depotRepository;
    @Autowired
    private TransaktionRepository transaktionRepository;
    @Autowired
    private NutzerRepository nutzerRepository;
    @Autowired
    private KontoRepository kontoRepository;

    public Depot saveDepot(Depot depot) {
        return depotRepository.save(depot);
    }

    public List<Depot> findAllDepots() {
        return depotRepository.findAll();
    }

    public List<Depot> findDepotsByDepotID(int depotID) {
        return depotRepository.findByDepotID(depotID);
    }

    public boolean deleteDepotById(int id) {
        if (depotRepository.existsById(id)) {
            depotRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public boolean aktieKaufen(int depotID, String isin, int anzahl) throws IOException {
        Depot existingDepot = depotRepository.findByDepotIDAndISIN(depotID, isin);

        Aktie aktie = new Aktie(isin);
        double preis = aktie.getAktienpreis() * anzahl;

        // Erstelle eine neue Transaktion für den Kauf

        Transaktion transaktion = new Transaktion(isin, preis, anzahl, "Kauf", depotID);
        // Speichere die Transaktion in der Datenbank
        transaktionRepository.save(transaktion);

        if (existingDepot != null) {
            // Das Depot für diese ISIN existiert bereits, erhöhe die Anzahl
            int currentAnzahl = existingDepot.getAnzahl();
            int neueAnzahl = currentAnzahl + anzahl;
            existingDepot.setAnzahl(neueAnzahl);
            depotRepository.save(existingDepot);

        } else {
            // Das Depot für diese ISIN existiert nicht, erstelle einen neuen Eintrag
            Depot newDepot = new Depot(depotID, isin, anzahl);
            depotRepository.save(newDepot);
        }

        return true;
    }

    public boolean aktieVerkaufen(int depotID, String isin, int anzahl) throws IOException {
        Depot existingDepot = depotRepository.findByDepotIDAndISIN(depotID, isin);
        Aktie aktie = new Aktie(isin);
        double preis = aktie.getAktienpreis() * anzahl;
        // Erstelle eine neue Transaktion für den Verkauf
        Transaktion transaktion = new Transaktion(isin, preis, anzahl, "Verkauf", depotID);
        // Speichere die Transaktion in der Datenbank
        transaktionRepository.save(transaktion);
        if (existingDepot != null) {
            // Das Depot für diese ISIN existiert, überprüfe ob ausreichend Aktien vorhanden sind
            int currentAnzahl = existingDepot.getAnzahl();
            if (currentAnzahl >= anzahl) {
                // Es sind ausreichend Aktien vorhanden, verringere die Anzahl
                int neueAnzahl = currentAnzahl - anzahl;
                existingDepot.setAnzahl(neueAnzahl);
                depotRepository.save(existingDepot);
                // Überprüfe, ob alle Aktien verkauft wurden
                if (neueAnzahl == 0) {
                    // Löschen Sie den Depot-Eintrag aus der Datenbank
                    depotRepository.delete(existingDepot);
                }
                return true;
            } else {
                // Es sind nicht genügend Aktien vorhanden, Verkauf nicht möglich
                return false;
            }
        } else {
            // Das Depot für diese ISIN existiert nicht, Verkauf nicht möglich
            return false;
        }
    }
    
}
