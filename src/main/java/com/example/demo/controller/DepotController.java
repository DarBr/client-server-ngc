package com.example.demo.controller;

import com.example.demo.model.Depot;
import com.example.demo.service.DepotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/depot")
public class DepotController {

    private final DepotService depotService;

    @Autowired
    public DepotController(DepotService depotService) {
        this.depotService = depotService;
    }

    @PostMapping("/add")
    public ResponseEntity<Depot> addDepot(@RequestBody Depot depot) {
        Depot newDepot = depotService.saveDepot(depot);
        return new ResponseEntity<>(newDepot, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Depot>> getAllDepots() {
        List<Depot> depots = depotService.findAllDepots();
        return new ResponseEntity<>(depots, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Depot> getDepotById(@PathVariable int id) {
        return depotService.findDepotById(id)
                .map(depot -> new ResponseEntity<>(depot, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepot(@PathVariable int id) {
        if (depotService.deleteDepotById(id)) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}

    

