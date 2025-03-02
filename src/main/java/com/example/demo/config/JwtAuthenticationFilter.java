package com.example.demo.config;

import com.example.demo.model.Nutzer;
import com.example.demo.service.NutzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private NutzerService nutzerService;

    @Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

    System.out.println("DEBUG: JwtAuthenticationFilter triggered!");

    String bearerToken = request.getHeader("Authorization");
    System.out.println("DEBUG: bearerToken = " + bearerToken);

    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        System.out.println("DEBUG: Token found, validating...");

        String token = bearerToken.substring(7);
        if (jwtUtil.validateToken(token)) {
            String nutzername = jwtUtil.getUsernameFromToken(token);
            Nutzer nutzer = nutzerService.getNutzerByUsername(nutzername);

            System.out.println("DEBUG: username aus Token = " + nutzername);
            System.out.println("DEBUG: nutzer aus DB      = " + nutzer);

            if (nutzer != null) {
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("USER"));

                if ("Admin".equalsIgnoreCase(nutzer.getUsername())) {
                    authorities.add(new SimpleGrantedAuthority("ADMIN"));
                }

                SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(nutzer, null, authorities)
                );
            } else {
                System.out.println("DEBUG: Nutzer ist null -> Keine Authorities vergeben");
            }
        } else {
            System.out.println("DEBUG: Token ist ungültig (validateToken=false)");
        }
    } else {
        System.out.println("DEBUG: Kein Bearer-Token im Header -> Filter wird übersprungen");
    }

    filterChain.doFilter(request, response);
}

}
