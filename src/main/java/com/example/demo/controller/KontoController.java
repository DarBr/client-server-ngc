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
}
