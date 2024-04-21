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
            System.out.println("Token: " + token);
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.ok("Login fehlgeschlagen");
        }
        /* 
        if (existingUser != null && (password.equals(existingUser.getPassword()))){
            return ResponseEntity.ok(existingUser.getId());
        } else {
            return ResponseEntity.status(401).body("Falscher Benutzername oder Passwort");
        }
        */
    }
}
