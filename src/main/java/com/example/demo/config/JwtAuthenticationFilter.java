package com.example.demo.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.model.Nutzer;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private JwtUtil jwtUtil;

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
      String username = request.getParameter("username");
      String password = request.getParameter("password");

      if (username != null && password != null) {
          Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
          SecurityContextHolder.getContext().setAuthentication(authentication);

          Nutzer nutzer = (Nutzer) authentication.getPrincipal();
          String token = jwtUtil.generateToken(nutzer);

          response.addHeader("Authorization", "Bearer " + token);
      }

      filterChain.doFilter(request, response);
  }
}
