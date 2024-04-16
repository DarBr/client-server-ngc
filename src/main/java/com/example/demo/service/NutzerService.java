package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Konto;
import com.example.demo.model.Nutzer;
import com.example.demo.repository.KontoRepository;
import com.example.demo.repository.NutzerRepository;

import java.util.List;
import java.util.Optional;

@Service
public class NutzerService {
    @Autowired
    private NutzerRepository nutzerRepository;
    @Autowired
    private KontoRepository kontoRepository;

    public Nutzer saveNutzer(Nutzer nutzer) {

        if (checkUserExists(nutzer.getUsername())) {
            System.err.println("Nutzer existiert bereits");
            return null;
            
        } else {
            // Hier wird ein neues Konto für den Nutzer erstellt und gespeichert
            Konto konto = new Konto();
            konto.setKontostand(1000.0); // Setzen Sie den Anfangskontostand nach Bedarf
            konto = kontoRepository.save(konto); // Das Konto wird gespeichert, um seine ID zu erhalten
            int id = konto.getKontoID();
            // Setzen Sie die Konto-ID im Nutzerobjekt
            nutzer.setKontoID(id);
            nutzer.setDepotID(id);

            // Speichern Sie den Nutzer mit der zugewiesenen Konto-ID
            return nutzerRepository.save(nutzer);
        }

    }

    public List<Nutzer> getAllNutzer() {
        return nutzerRepository.findAll();
    }

    public Nutzer getNutzerById(int id) {
        return nutzerRepository.findById(id).orElse(null);
    }

    public void deleteNutzer(int id) {
        nutzerRepository.deleteById(id);
    }

    public boolean checkUserExists(String username) {
        Optional<Nutzer> nutzer = nutzerRepository.findByUsername(username);
        return nutzer.isPresent();
    }
}
