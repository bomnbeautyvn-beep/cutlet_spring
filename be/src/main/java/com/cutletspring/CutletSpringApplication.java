package com.cutletspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CutletSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(CutletSpringApplication.class, args);
    }
}
