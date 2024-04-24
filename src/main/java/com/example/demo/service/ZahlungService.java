package com.example.demo.service;

import com.example.demo.model.Zahlung;
import com.example.demo.repository.ZahlungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<Zahlung> findZahlungByKontoId(int id) {
        List<Zahlung> zahlungen = zahlungRepository.findAll();
        List<Zahlung> result = new ArrayList<Zahlung>();
        for (Zahlung zahlung : zahlungen) {
            if (zahlung.getKontoID() == id) {
                result.add(zahlung);
            }
        }
        return result;
    }
}
