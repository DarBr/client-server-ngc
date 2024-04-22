package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.Nutzer;
import com.example.demo.service.NutzerService;

import java.util.List;

@RestController
@RequestMapping("/nutzer")
@CrossOrigin("*")
public class NutzerController {

    @Autowired
    private NutzerService nutzerService;

    @Autowired
    private JwtUtil jwtUtil;
    
    // Nutzer hinzufügen
    @PostMapping("/add")
    public Nutzer erstelleNutzer(@RequestBody Nutzer nutzer) {
        return nutzerService.saveNutzer(nutzer);
    }

    //Alle Nutzer abrufen
    @GetMapping
    public List<Nutzer> alleNutzerAbrufen() {
        return nutzerService.getAllNutzer();
    }

    //Nutzer nach ID abrufen
    @GetMapping("/{id}")
    public Nutzer findeNutzerById(@PathVariable int id) {
        return nutzerService.getNutzerById(id);
    }

    //Nutzer löschen
    @DeleteMapping("/{id}")
    public void loescheNutzer(@PathVariable int id) {
        nutzerService.deleteNutzer(id);
    }

    //Nutzer login überprüfen
    @GetMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        Nutzer nutzer = nutzerService.getNutzerByUsername(username);

        if (nutzer != null && nutzer.getPassword().equals(password)) {
            String token = jwtUtil.generateToken(nutzer);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.ok("Login fehlgeschlagen");
        }
    }

    //Nutzer login überprüfen
    @GetMapping("/validateToken")
    public ResponseEntity<?> validateToken(@RequestParam String tokenuebergeben) {
        boolean tokenValid = jwtUtil.validateToken(tokenuebergeben);
        if (tokenValid) {
            return ResponseEntity.ok(tokenValid);
        } else {
            return ResponseEntity.ok(tokenValid);
        }
    }

    //Username from Token
    @GetMapping("/usernamefromtoken")
    public ResponseEntity<?> usernameFromToken(@RequestParam String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            return ResponseEntity.ok(username);
        } else {
            return ResponseEntity.ok("Kein Username gefunden");
        }
    }
}
