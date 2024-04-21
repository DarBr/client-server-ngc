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
import java.util.Optional;

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
        Nutzer nutzer = nutzerRepository.findByDepotID(depotID);
        int kontoID = nutzer.getKontoID();
        Depot existingDepot = depotRepository.findByDepotIDAndISIN(depotID, isin);
    
        Aktie aktie = new Aktie(isin);
        double einzelpreis = aktie.getAktienpreis();
        double gesamtpreis = Math.round((einzelpreis * anzahl) * 100.0) / 100.0;
    
        // Überprüfe, ob das Konto ausreichend Geld hat
        Optional<Konto> optionalNutzerkonto = kontoRepository.findById(kontoID);
        if (optionalNutzerkonto.isPresent()) {
            Konto nutzerkonto = optionalNutzerkonto.get();
            if (nutzerkonto.getKontostand() < gesamtpreis) {
                // Das Konto hat nicht genügend Geld, um die Aktie zu kaufen
                return false;
            }
        } else {
            // Handle den Fall, wenn das Konto nicht gefunden wurde
            throw new IllegalArgumentException("Konto nicht gefunden für ID: " + kontoID);
        }
    
        // Führe den Kaufvorgang nur durch, wenn das Konto genügend Geld hat
        if (existingDepot != null) {
            // Das Depot für diese ISIN existiert bereits, erhöhe die Anzahl
            int currentAnzahl = existingDepot.getAnzahl();
            int neueAnzahl = currentAnzahl + anzahl;
            existingDepot.setAnzahl(neueAnzahl);
    
            // Berechne den neuen Einstandspreis für die Aktie
            double neuerEinstandspreis = Math
                    .round(((existingDepot.getEinstandspreis() * currentAnzahl + einzelpreis * anzahl)
                            / neueAnzahl) * 100.0)
                    / 100.0;
            existingDepot.setEinstandspreis(neuerEinstandspreis);
            depotRepository.save(existingDepot);
    
        } else {
            // Das Depot für diese ISIN existiert nicht, erstelle einen neuen Eintrag
            Depot newDepot = new Depot(depotID, isin, anzahl, einzelpreis);
            depotRepository.save(newDepot);
        }
    
        // Erstelle eine neue Transaktion für den Kauf
        Transaktion transaktion = new Transaktion(isin, gesamtpreis, anzahl, "Kauf", depotID);
        // Speichere die Transaktion in der Datenbank
        transaktionRepository.save(transaktion);
    
        // Ziehen Sie den Gesamtpreis vom Konto des Nutzers ab
        Konto nutzerkonto = optionalNutzerkonto.get();
        nutzerkonto.setKontostand(nutzerkonto.getKontostand() - gesamtpreis);
        kontoRepository.save(nutzerkonto);
    
        return true;
    }
    

    @Transactional
public boolean aktieVerkaufen(int depotID, String isin, int anzahl) throws IOException {
    Nutzer nutzer = nutzerRepository.findByDepotID(depotID);
    int kontoID = nutzer.getKontoID();
    
    Depot existingDepot = depotRepository.findByDepotIDAndISIN(depotID, isin);
    Aktie aktie = new Aktie(isin);
    double einzelpreis = aktie.getAktienpreis();
    double gesamtpreis = einzelpreis * anzahl;

    // Überprüfe, ob das Depot existiert und der Nutzer ausreichend Aktien besitzt
    if (existingDepot != null && existingDepot.getAnzahl() >= anzahl) {
        // Aktualisiere das Depot um die verkauften Aktien zu entfernen oder zu aktualisieren
        int currentAnzahl = existingDepot.getAnzahl();
        int neueAnzahl = currentAnzahl - anzahl;
        existingDepot.setAnzahl(neueAnzahl);
        depotRepository.save(existingDepot);

        // Überprüfe, ob alle Aktien verkauft wurden und lösche den Depot-Eintrag falls notwendig
        if (neueAnzahl == 0) {
            depotRepository.delete(existingDepot);
        }

        // Buche den Verkaufspreis auf das Konto des Nutzers
        Optional<Konto> optionalNutzerkonto = kontoRepository.findById(kontoID);
        if (optionalNutzerkonto.isPresent()) {
            Konto nutzerkonto = optionalNutzerkonto.get();
            nutzerkonto.setKontostand(nutzerkonto.getKontostand() + gesamtpreis);
            kontoRepository.save(nutzerkonto);
        } else {
            // Handle den Fall, wenn das Konto nicht gefunden wurde
            throw new IllegalArgumentException("Konto nicht gefunden für ID: " + kontoID);
        }

        // Erstelle eine neue Transaktion für den Verkauf
        Transaktion transaktion = new Transaktion(isin, gesamtpreis, anzahl, "Verkauf", depotID);
        // Speichere die Transaktion in der Datenbank
        transaktionRepository.save(transaktion);

        return true;
    } else {
        // Es sind nicht genügend Aktien vorhanden oder das Depot existiert nicht, Verkauf nicht möglich
        return false;
    }
}


}
