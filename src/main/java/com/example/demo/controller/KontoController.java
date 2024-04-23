package com.example.demo.controller;

import com.example.demo.model.Konto;
import com.example.demo.service.KontoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/konto")
public class KontoController {

    @Autowired
    private KontoService kontoService;

    @PostMapping("/speichern")
    public ResponseEntity<Konto> speichereKonto(@RequestBody Konto konto) {
        Konto savedKonto = kontoService.saveKonto(konto);
        return new ResponseEntity<>(savedKonto, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<Iterable<Konto>> alleKontenAbrufen() {
        Iterable<Konto> konten = kontoService.getAllKonten();
        return new ResponseEntity<>(konten, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Konto> findeKontoById(@PathVariable int id) {
        Konto konto = kontoService.getKontoById(id);
        if (konto != null) {
            return new ResponseEntity<>(konto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> loescheKonto(@PathVariable int id) {
        kontoService.deleteKonto(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/einzahlen")
    public ResponseEntity<Konto> einzahlen(@RequestParam int kontoID, @RequestParam double betrag) {
        kontoService.einzahlen(kontoID, betrag);
        Konto konto = kontoService.getKontoById(kontoID);
        return new ResponseEntity<>(konto, HttpStatus.OK);
    }
    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/auszahlen")
    public ResponseEntity<?> auszahlen(@RequestParam int kontoID, @RequestParam double betrag) {
        try {
            kontoService.auszahlen(kontoID, betrag);
            Konto konto = kontoService.getKontoById(kontoID);
            return new ResponseEntity<>(konto, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
