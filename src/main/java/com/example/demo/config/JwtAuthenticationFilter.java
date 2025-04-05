package com.example.demo.config;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.model.Nutzer;
import com.example.demo.service.NutzerService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private JwtUtil jwtUtil;

  @Autowired
  private NutzerService nutzerService;

  //Filtert jede eingehende Anfrage, um JWT-Authentifizierung durchzuführen
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    
    // Holt den Wert des "Authorization"-Headers aus der Anfrage
    String bearerToken = request.getHeader("Authorization");

    // Überprüft, ob der Header nicht null ist und mit "Bearer " beginnt
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        
        // Extrahiert den Token-Teil des Headers (ohne "Bearer ")
        String token = bearerToken.substring(7);
        
        // Überprüft, ob das Token gültig ist
        if (jwtUtil.validateToken(token)) {
            // Falls gültig, extrahiert den Benutzernamen aus dem Token
            String nutzername = jwtUtil.getUsernameFromToken(token);

            // Holt den Nutzer aus der Datenbank anhand des Benutzernamens
            Nutzer nutzer = nutzerService.getNutzerByUsername(nutzername);

            // Setzt den authentifizierten Benutzer im SecurityContext
            SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(nutzer, null, new ArrayList<>()));
        }
    }
    filterChain.doFilter(request, response); // Leitet die Anfrage an die nächste Filterinstanz weiter
  }
}
