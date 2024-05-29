package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.Konto;
import com.example.demo.model.Nutzer;
import com.example.demo.model.Zahlung;
import com.example.demo.repository.KontoRepository;
import com.example.demo.repository.NutzerRepository;
import com.example.demo.repository.ZahlungRepository;

import java.util.List;
import java.util.Optional;

@Service
public class NutzerService {
    @Autowired
    private NutzerRepository nutzerRepository;
    @Autowired
    private KontoRepository kontoRepository;
    @Autowired
    private ZahlungRepository zahlungRepository;
    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Nutzer saveNutzer(String username, String password, double startBudget) {

        if (checkUserExists(username)) {
            System.err.println("Nutzer existiert bereits");
            return null;
            
        } else {
            // Hier wird ein neues Konto für den Nutzer erstellt und das Startbudget gespeichert
            Konto konto = new Konto();
            konto.setKontostand(startBudget);
            kontoRepository.save(konto); // Das Konto wird gespeichert
            int id = konto.getKontoID();
            //Zahlung erstellen
            Zahlung zahlung = new Zahlung(startBudget, "Einzahlung", id);
            zahlungRepository.save(zahlung);
            // Nutzer erstellen           
            Nutzer nutzer = new Nutzer();
            // Setzen Sie die Konto-ID und Depot-ID im Nutzerobjekt
            nutzer.setUsername(username);
            nutzer.setKontoID(id);
            nutzer.setDepotID(id);
            // Hash the password
            String hashedPassword = passwordEncoder.encode(password);
            nutzer.setPassword(hashedPassword);
            // Speichern Sie den Nutzer mit der zugewiesenen Konto-ID
            return nutzerRepository.save(nutzer);
        }

    }

    public List<Nutzer> getAllNutzer() {
        return nutzerRepository.findAll();
    }

    public Nutzer getNutzerById(int id) {
        return nutzerRepository.findById(id).orElse(null);
    }

    public Nutzer getNutzerByUsername(String username) {
        return nutzerRepository.findByUsername(username).orElse(null);
    }

    public void deleteNutzer(int id) {
        nutzerRepository.deleteById(id);
    }

    public boolean checkUserExists(String username) {
        Optional<Nutzer> nutzer = nutzerRepository.findByUsername(username);
        return nutzer.isPresent();
    }

    public Nutzer getNutzerByDepotId(int depotId) {
        return nutzerRepository.findByDepotID(depotId);
    }

    public int getuserIDByUsername(String username) {
        Nutzer nutzer = nutzerRepository.findByUsername(username).orElse(null);
        if (nutzer != null) {
            return nutzer.getId();
        } else {
            return 0;
        }
    }

    public int getkontoIDByUsername(String username) {
        Nutzer nutzer = nutzerRepository.findByUsername(username).orElse(null);
        if (nutzer != null) {
            return nutzer.getKontoID();
        } else {
            return 0;
        }
    }

    public int getdepotIDByUsername(String username) {
        Nutzer nutzer = nutzerRepository.findByUsername(username).orElse(null);
        if (nutzer != null) {
            return nutzer.getDepotID();
        } else {
            return 0;
        }
    }

    //Login des Nutzers
    public String loginNutzer(String username, String password){
        Nutzer nutzer = getNutzerByUsername(username);
        if (nutzer != null && passwordEncoder.matches(password, nutzer.getPassword())) {
            String token = jwtUtil.generateToken(nutzer);
            return token;
        } else {
            return "Login fehlgeschlagen";
        }
    }

    //Password des Nutzers ändern
    public String changePassword(String username, String password, String newPassword) {
        Nutzer nutzer = getNutzerByUsername(username);
        if(nutzer == null){
            return "Nutzer existiert nicht";
        }
        if (passwordEncoder.matches(password, nutzer.getPassword())) {
            String hashedPassword = passwordEncoder.encode(newPassword);
            nutzer.setPassword(hashedPassword);
            nutzerRepository.save(nutzer);
            return "Passwort erfolgreich geändert";
        } else {
            return "Das aktuelle Passwort ist falsch";
        }
    }

    //Benutzername des Nutzers ändern
    public String changeUsername(String username, String newUsername) {
        Nutzer nutzer = getNutzerByUsername(username);
        if(nutzer == null){
            return "Nutzer existiert nicht";
        }
        if (!checkUserExists(newUsername)) {
            nutzer.setUsername(newUsername);
            nutzerRepository.save(nutzer);
            return "Benutzername erfolgreich geändert";
        } else {
            return "Der neue Benutzername existiert bereits. Bitte wählen Sie einen anderen Benutzernamen aus.";
        }
    }
}
