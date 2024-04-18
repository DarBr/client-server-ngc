package com.example.demo.service;

import com.example.demo.model.Konto;
import com.example.demo.model.Zahlung;
import com.example.demo.repository.KontoRepository;
import com.example.demo.repository.ZahlungRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KontoService {
    @Autowired
    private KontoRepository kontoRepository;
    @Autowired
    private ZahlungRepository zahlungsRepository;

    public Konto saveKonto(Konto konto) {
        return kontoRepository.save(konto);
    }

    public Konto getKontoById(int id) {
        return kontoRepository.findById(id).orElse(null);
    }

    public void deleteKonto(int id) {
        kontoRepository.deleteById(id);
    }

    public Iterable<Konto> getAllKonten() {
        return kontoRepository.findAll();
    }

    public void einzahlen(int kontoID, double betrag) {
        Konto konto = kontoRepository.findById(kontoID).orElse(null);
        if (konto != null) {
            Zahlung zahlung = new Zahlung(betrag, "Einzahlung", kontoID);
            zahlungsRepository.save(zahlung);

            konto.setKontostand(konto.getKontostand() + betrag);
            kontoRepository.save(konto);
        }
    }

    public void auszahlen(int kontoID, double betrag) {
        Konto konto = kontoRepository.findById(kontoID).orElse(null);
        if (konto != null) {
            Zahlung zahlung = new Zahlung(betrag, "Auszahlung", kontoID);
            zahlungsRepository.save(zahlung);

            konto.setKontostand(konto.getKontostand() - betrag);
            kontoRepository.save(konto);
        }
    }
}
