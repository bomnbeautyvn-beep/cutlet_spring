package com.cutletspring.shared.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Public health check and keep-alive ping controller.
 * Accessible without authentication to support monitoring tools (e.g. UptimeRobot, cron jobs, Render keep-alive).
 */
@RestController
@Tag(name = "Health Check", description = "Public health check and keep-alive ping endpoints")
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final DataSource dataSource;

    @Operation(
            summary = "Health check and keep-alive ping",
            description = "Returns operational status, uptime, and database connectivity. Designed for auto-pinging services."
    )
    @GetMapping({"/api/health", "/health"})
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", "UP");
        response.put("message", "Cutlet Spring Atelier Backend is operational");
        response.put("timestamp", Instant.now().toString());
        response.put("service", "cutlet-spring-be");

        long uptimeMillis = ManagementFactory.getRuntimeMXBean().getUptime();
        response.put("uptimeSeconds", uptimeMillis / 1000);

        String dbStatus = checkDatabase();
        response.put("database", dbStatus);

        return ResponseEntity.ok(response);
    }

    @Operation(
            summary = "Lightweight HEAD ping",
            description = "Returns HTTP 200 without payload for bandwidth-efficient keep-alive pings."
    )
    @RequestMapping(value = {"/api/health", "/health"}, method = RequestMethod.HEAD)
    public ResponseEntity<Void> pingHead() {
        return ResponseEntity.ok().build();
    }

    private String checkDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(2)) {
                return "CONNECTED";
            }
            return "DEGRADED";
        } catch (Exception e) {
            log.warn("Database health check ping error: {}", e.getMessage());
            return "UNAVAILABLE";
        }
    }
}
