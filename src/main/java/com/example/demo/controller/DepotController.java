package com.example.demo.controller;

import com.example.demo.model.Depot;
import com.example.demo.service.DepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/depot")
public class DepotController {

    @Autowired
    private DepotService depotService;

    @PostMapping("/add")
    public ResponseEntity<String> addDepot(@RequestBody Depot depot) {
        depotService.saveDepot(depot);
        return new ResponseEntity<>("Depot added successfully!", HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Depot>> getAllDepots() {
        List<Depot> depots = depotService.findAllDepots();
        return new ResponseEntity<>(depots, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Depot>> findDepotsByDepotID(@PathVariable int id) {
        List<Depot> depots = depotService.findDepotsByDepotID(id);
        if (depots.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(depots, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepot(@PathVariable int id) {
        if (depotService.deleteDepotById(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/kaufen")
    public ResponseEntity<String> kaufeAktie(@RequestParam int depotID, @RequestParam String isin,
            @RequestParam int anzahl) throws IOException {
        boolean success = depotService.aktieKaufen(depotID, isin, anzahl);

        if (success) {
            return new ResponseEntity<>("Aktie erfolgreich gekauft!", HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>("Kauf fehlgeschlagen - Depot nicht gefunden oder ungültige ISIN.",
                    HttpStatus.NOT_FOUND);
        }
    }

}
