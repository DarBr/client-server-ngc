package com.example.demo.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
        
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;        

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(requests -> requests
                .requestMatchers("/nutzer/**", "/nutzer/login", "/konto/**", "/konto/speichern", "/konto/einzahlen", "/depot/**", "/depot/kaufen", "/transaktionen/**", "/zahlungen/**")
                .permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter.class)
            .csrf().disable(); // CSRF-Schutz deaktivieren
        return http.build();
    }
}
