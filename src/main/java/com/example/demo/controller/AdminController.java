package com.example.demo.controller;

import com.example.demo.dto.AdminUserDto;
import com.example.demo.model.Nutzer;
import com.example.demo.service.NutzerService;
import com.example.demo.service.PortfolioSnapshotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private NutzerService nutzerService;

    @Autowired
    private PortfolioSnapshotService portfolioSnapshotService;

    @GetMapping("/dashboard")
    public ResponseEntity<List<AdminUserDto>> getDashboard() {
        List<Nutzer> users = nutzerService.getAllNutzer();
        List<AdminUserDto> adminUsers = new ArrayList<>();
        for (Nutzer user : users) {
            // Berechne den aktuellen Portfoliowert mithilfe der vorhandenen Methode
            double portfolioValue = portfolioSnapshotService.calculateCurrentPortfolioValueForUser(user.getKontoID(), user.getDepotID());
            adminUsers.add(new AdminUserDto(user.getId(), user.getUsername(), user.getDepotID(), portfolioValue));
        }
        return ResponseEntity.ok(adminUsers);
    }

    @DeleteMapping("/nutzer/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        nutzerService.deleteNutzer(id);
        return ResponseEntity.noContent().build();
    }
}
