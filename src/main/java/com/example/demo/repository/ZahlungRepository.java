package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Zahlung;

@Repository
public interface ZahlungRepository extends JpaRepository<Zahlung, Integer> {

    List<Zahlung> findByKontoID(int kontoID);
    void deleteByKontoID(int kontoID);
}
