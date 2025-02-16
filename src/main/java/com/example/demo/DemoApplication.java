package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.example.demo")
@EnableScheduling
public class DemoApplication {

	//startet den Spring Boot Server

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
