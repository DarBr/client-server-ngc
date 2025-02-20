package com.example.demo.controller;

import com.example.demo.model.PortfolioSnapshot;
import com.example.demo.repository.PortfolioSnapshotRepository;
import com.example.demo.service.PortfolioSnapshotService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/portfolio")
@CrossOrigin("*")
public class PortfolioSnapshotController {

    @Autowired
    private PortfolioSnapshotRepository portfolioSnapshotRepository;
    @Autowired
    private PortfolioSnapshotService portfolioSnapshotService;

    // NEU: Endpunkt zum Abrufen der Snapshots für eine bestimmte Depot-ID
    @GetMapping("/snapshots/{depotId}")
    public ResponseEntity<List<PortfolioSnapshot>> getSnapshotsForDepot(@PathVariable int depotId) {
        List<PortfolioSnapshot> snapshots = portfolioSnapshotRepository.findByDepotId(depotId);
        return new ResponseEntity<>(snapshots, HttpStatus.OK);
    }

    @GetMapping("/snapshots")
    public ResponseEntity<List<PortfolioSnapshot>> getSnapshots() {
        List<PortfolioSnapshot> snapshots = portfolioSnapshotRepository.findAll();
        return new ResponseEntity<>(snapshots, HttpStatus.OK);
    }

    @PostMapping("/snapshots")
    public ResponseEntity<PortfolioSnapshot> addSnapshot(@RequestBody PortfolioSnapshot snapshot) {
        PortfolioSnapshot savedSnapshot = portfolioSnapshotRepository.save(snapshot);
        return new ResponseEntity<>(savedSnapshot, HttpStatus.CREATED);
    }

    @DeleteMapping("/snapshots/{id}")
    public ResponseEntity<Void> deleteSnapshot(@PathVariable Long id) {
        portfolioSnapshotRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/snapshotsFromUser/{depotId}")
    public ResponseEntity<Void> deleteSnapshotsFromUser(@PathVariable int depotId) {
        portfolioSnapshotService.deleteSnapshotsForUser(depotId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    
}
