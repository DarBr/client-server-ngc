// WebConfig.java in deinem Spring Boot-Projekt
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class Webconfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Stelle sicher, dass die URL und der Port mit deiner Angular-Anwendung übereinstimmen.
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200", "http://3.142.199.164/")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
