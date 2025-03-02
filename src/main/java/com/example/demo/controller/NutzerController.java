package com.example.demo.controller;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.LoginHistory;
import com.example.demo.model.Nutzer;
import com.example.demo.repository.LoginHistoryRepository;
import com.example.demo.repository.NutzerRepository;
import com.example.demo.service.NutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/nutzer")
@CrossOrigin("*")
public class NutzerController {

    @Autowired
    private NutzerService nutzerService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NutzerRepository nutzerRepository;
    
    // Neue Injection: LoginHistoryRepository
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    // Nutzer hinzufügen
    @PostMapping("/add")
    public Nutzer erstelleNutzer(@RequestParam String username, 
                                  @RequestParam String password, 
                                  @RequestParam double startBudget) {
        return nutzerService.saveNutzer(username, password, startBudget);
    }

    @GetMapping("/depotId/{nutzername}")
    public ResponseEntity<Integer> getDepotIdByNutzername(@PathVariable String nutzername) {
        Optional<Nutzer> nutzerOpt = nutzerRepository.findByUsername(nutzername);
        if (nutzerOpt.isPresent()) {
            return ResponseEntity.ok(nutzerOpt.get().getDepotID());
        }
        return ResponseEntity.notFound().build();
    }

    // Alle Nutzer abrufen
    @GetMapping
    public List<Nutzer> alleNutzerAbrufen() {
        return nutzerService.getAllNutzer();
    }

    // Nutzer nach ID abrufen
    @GetMapping("/{id}")
    public Nutzer findeNutzerById(@PathVariable int id) {
        return nutzerService.getNutzerById(id);
    }
    
    // Nutzer löschen
    @DeleteMapping("/{id}")
    public void loescheNutzer(@PathVariable int id) {
        nutzerService.deleteNutzer(id);
    }

    // Nutzer login überprüfen und Token zurückgeben
    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        String token = nutzerService.loginNutzer(username, password);
        if ("Login fehlgeschlagen".equals(token)) {
            return ResponseEntity.ok("Login fehlgeschlagen");
        } else {
            // Bei erfolgreichem Login: LoginHistory speichern
            Optional<Nutzer> optNutzer = nutzerRepository.findByUsername(username);
            if (optNutzer.isPresent()) {
                Nutzer nutzer = optNutzer.get();
                LoginHistory entry = new LoginHistory(nutzer.getId(), LocalDateTime.now());
                loginHistoryRepository.save(entry);
            }
            return ResponseEntity.ok(token);
        }
    }

    // Nutzer login überprüfen (Token validieren)
    @GetMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestParam String tokenuebergeben) {
        boolean tokenValid = jwtUtil.validateToken(tokenuebergeben);
        return ResponseEntity.ok(tokenValid);
    }

    // Username from Token
    @GetMapping("/usernamefromtoken")
    public ResponseEntity<?> usernameFromToken(@RequestParam String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.ok("Kein Username gefunden");
        }
    }

    // UserID from Token
    @GetMapping("/useridfromtoken")
    public ResponseEntity<?> userIDFromToken(@RequestParam String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            return ResponseEntity.ok(nutzerService.getuserIDByUsername(username));
        } else {
            return ResponseEntity.ok(0);
        }
    }

    // KontoID from Token
    @GetMapping("/kontoidfromtoken")
    public ResponseEntity<?> kontoIDFromToken(@RequestParam String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            return ResponseEntity.ok(nutzerService.getkontoIDByUsername(username));
        } else {
            return ResponseEntity.ok(0);
        }
    }

    // DepotID from Token
    @GetMapping("/depotidfromtoken")
    public ResponseEntity<?> depotIDFromToken(@RequestParam String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            return ResponseEntity.ok(nutzerService.getdepotIDByUsername(username));
        } else {
            return ResponseEntity.ok(0);
        }
    }

    // Passwort des Nutzers ändern
    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestParam String username, 
                                            @RequestParam String password, 
                                            @RequestParam String newPassword) {
        return ResponseEntity.ok(nutzerService.changePassword(username, password, newPassword));
    }

    // Benutzername des Nutzers ändern
    @PostMapping("/changeUsername")
    public ResponseEntity<?> changeUsername(@RequestParam String username, 
                                            @RequestParam String newUsername) {
        return ResponseEntity.ok(nutzerService.changeUsername(username, newUsername));
    }
}
