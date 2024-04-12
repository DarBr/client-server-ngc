package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Transaktion;

@Repository
public interface TransaktionRepository extends JpaRepository<Transaktion, Integer> {
    // Hier können zusätzliche, spezifische Methoden definiert werden, falls benötigt
}
