package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.config.JwtAuthenticationFilter;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // Definiere eine CorsConfigurationSource-Bean
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Erlaube, dass Credentials (Cookies usw.) gesendet werden
        configuration.setAllowCredentials(true);
        // Erlaube den Zugriff von der Angular-App (Passe ggf. an)
        configuration.addAllowedOrigin("http://localhost:4200");
        // Erlaube alle Header
        configuration.addAllowedHeader("*");
        // Erlaube alle HTTP-Methoden (GET, POST, PUT, DELETE, OPTIONS, ...)
        configuration.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Diese CORS-Konfiguration gilt für alle Endpunkte
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Setze die CORS-Konfiguration mithilfe der oben definierten Bean
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(requests -> requests
                .requestMatchers(
                    "/nutzer/add", "/nutzer/login", "/nutzer/validateToken", 
                    "/nutzer/depotidfromtoken", "/nutzer/kontoidfromtoken", 
                    "/nutzer/useridfromtoken", "/nutzer/usernamefromtoken", "/portfolio/**"
                ).permitAll()
                .requestMatchers("/admin/**").hasAuthority("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter.class)
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
