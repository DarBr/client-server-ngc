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

    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        String token = bearerToken.substring(7);
        if (jwtUtil.validateToken(token)) {
            String nutzername = jwtUtil.getUsernameFromToken(token);
            Nutzer nutzer = nutzerService.getNutzerByUsername(nutzername);

            // Setze ADMIN-Rechte, wenn der Nutzer "Admin" ist
            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
            if ("Admin".equalsIgnoreCase(nutzer.getUsername())) {
                authorities.add(new SimpleGrantedAuthority("ADMIN"));
            }
            SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(nutzer, null, authorities));
        }
    }
    filterChain.doFilter(request, response);
}
}
