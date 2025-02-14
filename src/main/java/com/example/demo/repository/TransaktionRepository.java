package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Transaktion;

@Repository
public interface TransaktionRepository extends JpaRepository<Transaktion, Integer> {
    List<Transaktion> findByDepotID(int depotID);
    void deleteByDepotID(int depotID);
}
