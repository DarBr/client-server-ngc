package com.example.demo.repository;

import com.example.demo.model.PortfolioSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioSnapshotRepository extends JpaRepository<PortfolioSnapshot, Long> {
    
    // NEU: Methode zum Abrufen von Snapshots für eine bestimmte Depot-ID
    List<PortfolioSnapshot> findByDepotId(int depotId);
}
