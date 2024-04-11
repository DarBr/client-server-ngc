package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Zahlung;

@Repository
public interface ZahlungRepository extends JpaRepository<Zahlung, Integer> {

    // Weitere Methoden zur Datenbankabfrage für Nutzer

}
