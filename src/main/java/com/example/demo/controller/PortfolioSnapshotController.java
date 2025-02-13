package com.example.demo.controller;

import com.example.demo.model.PortfolioSnapshot;
import com.example.demo.repository.PortfolioSnapshotRepository;
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

    @GetMapping("/snapshots")
    public ResponseEntity<List<PortfolioSnapshot>> getAllSnapshots() {
        List<PortfolioSnapshot> snapshots = portfolioSnapshotRepository.findAll();
        return new ResponseEntity<>(snapshots, HttpStatus.OK);
    }

    @PostMapping("/snapshots")
    public ResponseEntity<PortfolioSnapshot> addSnapshot(@RequestBody PortfolioSnapshot snapshot) {
        PortfolioSnapshot savedSnapshot = portfolioSnapshotRepository.save(snapshot);
        return new ResponseEntity<>(savedSnapshot, HttpStatus.CREATED);
    }
    
    
}
