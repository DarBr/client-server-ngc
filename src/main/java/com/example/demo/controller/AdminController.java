package com.example.demo.controller;

import com.example.demo.service.NutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    @Autowired
    private NutzerService nutzerService;

    // Hier löschst Du den Nutzer inkl. aller zugehörigen Daten
    @DeleteMapping("/nutzer/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        // NutzerService kümmert sich um die komplette Löschlogik
        nutzerService.deleteNutzer(id);
        return ResponseEntity.ok("Nutzer mit ID " + id + " (inklusive aller zugehörigen Daten) erfolgreich gelöscht.");
    }

    // Beispiel: Falls Du auch alle Nutzer fürs Admin-Dashboard abrufst
    @GetMapping("/dashboard")
    public ResponseEntity<?> getAllUsersForAdmin() {
        return ResponseEntity.ok(nutzerService.getAllNutzer());
    }
}
