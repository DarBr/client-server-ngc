package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Nutzer;
import com.example.demo.service.NutzerService;

import java.util.List;

@RestController
@RequestMapping("/nutzer")
public class NutzerController {

    @Autowired
    private NutzerService nutzerService;

    @PostMapping("/add")
    public Nutzer erstelleNutzer(@RequestBody Nutzer nutzer) {
        return nutzerService.saveNutzer(nutzer);
    }

    @GetMapping
    public List<Nutzer> alleNutzerAbrufen() {
        return nutzerService.getAllNutzer();
    }

    @GetMapping("/{id}")
    public Nutzer findeNutzerById(@PathVariable int id) {
        return nutzerService.getNutzerById(id);
    }

    @DeleteMapping("/{id}")
    public void loescheNutzer(@PathVariable int id) {
        nutzerService.deleteNutzer(id);
    }
}
