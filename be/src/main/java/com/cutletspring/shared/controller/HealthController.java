package com.cutletspring.shared.controller;

import com.cutletspring.shared.service.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Public health check and keep-alive ping controller.
 * Accessible without authentication to support monitoring tools (e.g.
 * UptimeRobot, cron jobs, Render keep-alive).
 */
@RestController
@Tag(name = "Health Check", description = "Public health check and keep-alive ping endpoints")
@RequiredArgsConstructor
public class HealthController {

    private final HealthService healthService;

    @Operation(summary = "Health check and keep-alive ping", description = "Returns operational status, uptime, and database connectivity. Designed for auto-pinging services.")
    @GetMapping({ "/api/health", "/health" })
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(healthService.checkHealth());
    }

    @Operation(summary = "Lightweight HEAD ping", description = "Returns HTTP 200 without payload for bandwidth-efficient keep-alive pings.")
    @RequestMapping(value = { "/api/health", "/health" }, method = RequestMethod.HEAD)
    public ResponseEntity<Void> pingHead() {
        return ResponseEntity.ok().build();
    }
}
