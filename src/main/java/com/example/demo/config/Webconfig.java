// WebConfig.java
package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class Webconfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200", "http://3.142.199.164") // Ohne abschließenden "/"
                .allowedMethods("*") // Erlaubt alle Methoden (GET, POST, PUT, DELETE, OPTIONS usw.)
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // Cache-Dauer für Preflight-Anfragen (in Sekunden)
    }
}
