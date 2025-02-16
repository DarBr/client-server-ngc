package com.example.demo.service;

import com.example.demo.model.Depot;
import com.example.demo.model.Konto;
import com.example.demo.model.Nutzer;
import com.example.demo.model.PortfolioSnapshot;
import com.example.demo.repository.DepotRepository;
import com.example.demo.repository.KontoRepository;
import com.example.demo.repository.NutzerRepository;
import com.example.demo.repository.PortfolioSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PortfolioSnapshotService {
    
    @Autowired
    private KontoRepository kontoRepository;

    @Autowired
    private DepotRepository depotRepository;

    @Autowired 
    private PriceService priceService;

    @Autowired
    private PortfolioSnapshotRepository portfolioSnapshotRepository;

    @Autowired
    private NutzerRepository nutzerRepository;

    /**
     * Berechnet den aktuellen Portfolio-Wert für einen bestimmten Nutzer anhand seiner Konto- und Depot-ID.
     *
     * @param kontoID die ID des Kontos (Bargeldbestand)
     * @param depotID die ID des Depots (Aktienpositionen)
     * @return Der Gesamtwert (Bargeld + Aktienwert)
     */
    public double calculateCurrentPortfolioValueForUser(int kontoID, int depotID) {
        // Bargeldbestand ermitteln
        double cashValue = 0.0;
        Optional<Konto> kontoOpt = kontoRepository.findById(kontoID);
        if (kontoOpt.isPresent()) {
            cashValue = kontoOpt.get().getKontostand();
        }

        // Aktienpositionen und deren aktuellen Wert berechnen
        double stocksValue = 0.0;
        List<Depot> depots = depotRepository.findByDepotID(depotID);
        for (Depot depot : depots) {
            try {
                double currentPrice = priceService.getCurrentPrice(depot.getISIN());
                stocksValue += currentPrice * depot.getAnzahl();
            } catch (Exception e) {
                System.err.println("Fehler beim Abrufen des Preises für ISIN "+ depot.getISIN() + ": " + e.getMessage());
            }
        }
        return cashValue + stocksValue;
    }

    /**
     * Dieser Scheduled Job wird täglich um 17:00 Uhr ausgeführt.
     * Er iteriert über alle registrierten Nutzer, berechnet den aktuellen Portfolio-Wert
     * und speichert für jeden einen Snapshot.
     */
    @Scheduled(cron = "0 45 15,15 22 * * *")
    public void takeDailySnapshotsForAllUsers() {
        List<Nutzer> userList = nutzerRepository.findAll();
        for (Nutzer user : userList) {
            int kontoID = user.getKontoID();
            int depotID = user.getDepotID();
            double currentValue = calculateCurrentPortfolioValueForUser(kontoID, depotID);
            PortfolioSnapshot snapshot = new PortfolioSnapshot(LocalDateTime.now(), currentValue, depotID);
            portfolioSnapshotRepository.save(snapshot);
            System.out.println("Snapshot für " + user.getUsername()+ " gespeichert: " + snapshot.getSnapshotTime()+ " - " + snapshot.getPortfolioValue());
        }
    }
}
