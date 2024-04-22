package com.example.demo.config;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
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

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

      String bearerToken = request.getHeader("Authorization");
      if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
          String token = bearerToken.substring(7);
          if (jwtUtil.validateToken(token)) {
              // Token ist gültig, setzen Sie den authentifizierten Benutzer in den SecurityContext
              String nutzername = jwtUtil.getUsernameFromToken(token);
              Nutzer nutzer = nutzerService.getNutzerByUsername(nutzername);
              SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(nutzer, null, new ArrayList<>()));
          }
      }

      filterChain.doFilter(request, response);
  }
}
