package com.example.demo.config;

import java.time.Instant;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.demo.model.Nutzer;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtUtil {

    private String secretKey = "ClientServerProjektNextGenCapitel"; // Ändern Sie dies zu einem sicheren Schlüssel!

    public String generateToken(Nutzer nutzer) {
        Claims claims = Jwts.claims().setSubject(nutzer.getUsername());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(Instant.now()))
                .setExpiration(Date.from(Instant.now().plusMillis(1000 * 60 * 30))) // 30 Minuten Gültigkeit
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            System.out.println("Ungültiges Token: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("Ungültiges Token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("Abgelaufenes Token: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("Nicht unterstütztes Token: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Ungültiges Token: " + e.getMessage());
        }

        return false;
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
                   .setSigningKey(secretKey)
                   .parseClaimsJws(token)
                   .getBody()
                   .getSubject();
    }
    
}
