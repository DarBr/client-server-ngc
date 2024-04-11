package com.example.demo.service;

import com.example.demo.model.Konto;
import com.example.demo.repository.KontoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KontoService {
    @Autowired
    private KontoRepository kontoRepository;

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
}
