package com.example.demo.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Nutzer;

@Repository
public interface NutzerRepository extends JpaRepository<Nutzer, Integer> {
    Optional<Nutzer> findByUsername(String username);
    

    // Weitere Methoden zur Datenbankabfrage für Nutzer

}
