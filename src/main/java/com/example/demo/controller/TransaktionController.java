package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Transaktion;
import com.example.demo.service.TransaktionService;

import java.util.List;

@RestController
@RequestMapping("/transaktionen")
public class TransaktionController {

    @Autowired
    private TransaktionService transaktionService;

    @PostMapping("/add")
    public ResponseEntity<Transaktion> erstelleTransaktion(@RequestBody Transaktion transaktion) {
        Transaktion savedTransaktion = transaktionService.saveTransaktion(transaktion);
        return new ResponseEntity<>(savedTransaktion, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Transaktion>> alleTransaktionenAbrufen() {
        List<Transaktion> transaktionen = transaktionService.findAllTransaktionen();
        return new ResponseEntity<>(transaktionen, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaktion> findeTransaktionById(@PathVariable int id) {
        Transaktion transaktion = transaktionService.findTransaktionById(id).orElse(null);
        return new ResponseEntity<>(transaktion, transaktion != null ? HttpStatus.OK : HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> loescheTransaktion(@PathVariable int id) {
        transaktionService.deleteTransaktionById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/transaktionenByKontoID/{id}")
    public List<Transaktion> findTransaktionByKontoId(@PathVariable int id) {
        return transaktionService.findTransaktionenByDepotID(id);
    }

    @DeleteMapping("/transaktionenByKontoID/{id}")
    public void loescheTransaktionByKontoId(@PathVariable int id) {
        transaktionService.deleteTransaktionenByDepotID(id);
    }
}
