package com.example.demo.service;

import com.example.demo.model.Depot;
import com.example.demo.repository.DepotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepotService {

    private final DepotRepository depotRepository;

    @Autowired
    public DepotService(DepotRepository depotRepository) {
        this.depotRepository = depotRepository;
    }

    public Depot saveDepot(Depot depot) {
        return depotRepository.save(depot);
    }

    public List<Depot> findAllDepots() {
        return depotRepository.findAll();
    }

    public Optional<Depot> findDepotById(int id) {
        return depotRepository.findById(id);
    }

    public boolean deleteDepotById(int id) {
        if(depotRepository.existsById(id)) {
            depotRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

