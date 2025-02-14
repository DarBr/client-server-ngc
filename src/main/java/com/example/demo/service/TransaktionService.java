package com.example.demo.service;

import com.example.demo.model.Transaktion;
import com.example.demo.repository.TransaktionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransaktionService {

    private final TransaktionRepository transaktionRepository;

    @Autowired
    public TransaktionService(TransaktionRepository transaktionRepository) {
        this.transaktionRepository = transaktionRepository;
    }

    public Transaktion saveTransaktion(Transaktion transaktion) {
        return transaktionRepository.save(transaktion);
    }

    public List<Transaktion> findAllTransaktionen() {
        return transaktionRepository.findAll();
    }

    public Optional<Transaktion> findTransaktionById(int id) {
        return transaktionRepository.findById(id);
    }

    public void deleteTransaktionById(int id) {
        transaktionRepository.deleteById(id);
    }

    public List<Transaktion> findTransaktionenByDepotID(int id) {
        return transaktionRepository.findByDepotID(id);
    }

    public void deleteTransaktionenByDepotID(int id) {
        List <Transaktion> transaktionen = findTransaktionenByDepotID(id);
        for (Transaktion transaktion : transaktionen) {
            deleteTransaktionById(transaktion.getTransaktionsID());
        }
    }
}
