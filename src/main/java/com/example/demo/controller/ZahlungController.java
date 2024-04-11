package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Zahlung;
import com.example.demo.service.ZahlungService;

import java.util.List;

@RestController
@RequestMapping("/zahlungen")
public class ZahlungController {

    @Autowired
    private ZahlungService zahlungService;

    @PostMapping("/add")
    public Zahlung erstelleZahlung(@RequestBody Zahlung zahlung) {
        return zahlungService.saveZahlung(zahlung);
    }

    @GetMapping
    public List<Zahlung> alleZahlungenAbrufen() {
        return zahlungService.findAllZahlungen();
    }

    @GetMapping("/{id}")
    public Zahlung findeZahlungById(@PathVariable int id) {
        return zahlungService.findZahlungById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void loescheZahlung(@PathVariable int id) {
        zahlungService.deleteZahlungById(id);
    }
}
