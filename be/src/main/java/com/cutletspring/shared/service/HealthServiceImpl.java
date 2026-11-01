package com.cutletspring.shared.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthServiceImpl implements HealthService {

    private final DataSource dataSource;

    @Override
    public Map<String, Object> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("message", "Cutlet Spring Atelier Backend is operational");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "cutlet-spring-be");

        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        response.put("uptimeSeconds", uptimeMillis / 1000);

        String dbStatus = checkDatabase(response);
        response.put("database", dbStatus);

        return response;
    }

    private String checkDatabase(Map<String, Object> response) {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                try (var stmt = conn.createStatement()) {
                    var rs = stmt.executeQuery("SELECT count(*) FROM admins");
                    if (rs.next()) {
                        response.put("adminAccounts", rs.getInt(1));
                    }
                } catch (Exception e) {
                    response.put("adminCheckError", e.getMessage());
                }
                return "CONNECTED";
            }
            return "DEGRADED";
        } catch (Exception e) {
            log.warn("Database health check ping error: {}", e.getMessage());
            return "UNAVAILABLE: " + e.getMessage();
        }
    }
}

