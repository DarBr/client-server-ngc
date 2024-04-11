package com.example.demo.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Nutzer;

@Repository
public interface NutzerRepository extends JpaRepository<Nutzer, Integer> {
    
    

    // Weitere Methoden zur Datenbankabfrage für Nutzer

}
