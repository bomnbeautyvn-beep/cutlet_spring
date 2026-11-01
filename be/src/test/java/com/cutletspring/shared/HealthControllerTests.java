package com.cutletspring.shared;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.head;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
public class HealthControllerTests {

    private final MockMvc mockMvc;

    @Autowired
    public HealthControllerTests(WebApplicationContext context) {
        this.mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    @Test
    @DisplayName("GET /api/health should return 200 OK with operational payload")
    void getApiHealthReturnsOk() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("cutlet-spring-be"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.uptimeSeconds").isNumber())
                .andExpect(jsonPath("$.database").value("CONNECTED"));
    }

    @Test
    @DisplayName("GET /health should return 200 OK with operational payload")
    void getHealthReturnsOk() throws Exception {
        mockMvc.perform(get("/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("cutlet-spring-be"));
    }

    @Test
    @DisplayName("HEAD /api/health should return 200 OK without body")
    void headApiHealthReturnsOk() throws Exception {
        mockMvc.perform(head("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("HEAD /health should return 200 OK without body")
    void headHealthReturnsOk() throws Exception {
        mockMvc.perform(head("/health"))
                .andExpect(status().isOk());
    }
}
