package com.example.demo.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Konto;

@Repository
public interface KontoRepository extends JpaRepository<Konto, Integer> {
    
    
    

    // Weitere Methoden zur Datenbankabfrage für Nutzer

}
