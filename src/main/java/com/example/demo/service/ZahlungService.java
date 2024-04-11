package com.example.demo.service;

import com.example.demo.model.Zahlung;
import com.example.demo.repository.ZahlungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ZahlungService {

    @Autowired
    private ZahlungRepository zahlungRepository;

    public Zahlung saveZahlung(Zahlung zahlung) {
        return zahlungRepository.save(zahlung);
    }

    public Optional<Zahlung> findZahlungById(int id) {
        return zahlungRepository.findById(id);
    }

    public List<Zahlung> findAllZahlungen() {
        return zahlungRepository.findAll();
    }

    public void deleteZahlungById(int id) {
        zahlungRepository.deleteById(id);
    }

    // Weitere Methoden nach Bedarf, z.B. zum Aktualisieren von Zahlungen
}
