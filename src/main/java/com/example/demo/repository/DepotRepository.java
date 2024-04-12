package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Depot;

@Repository
public interface DepotRepository extends JpaRepository<Depot, Integer> {
    // Hier können zusätzliche, spezifische Methoden definiert werden, falls benötigt
}
