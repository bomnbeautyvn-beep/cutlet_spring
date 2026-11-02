package com.cutletspring.database.filter;

import com.cutletspring.database.service.MaintenanceModeService;
import com.cutletspring.shared.response.ApiErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 50)
@RequiredArgsConstructor
public class MaintenanceModeFilter extends OncePerRequestFilter {

    private final MaintenanceModeService maintenanceModeService;
    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        if (maintenanceModeService.isMaintenanceMode()) {
            String path = request.getRequestURI();

            // Allow database admin endpoints, authentication, actuator and preflight OPTIONS
            if ("OPTIONS".equalsIgnoreCase(request.getMethod())
                    || path.contains("/admin/database")
                    || path.contains("/auth/")
                    || path.contains("/actuator")
                    || path.contains("/error")) {
                filterChain.doFilter(request, response);
                return;
            }

            log.warn("Blocked request to {} due to active Database Maintenance Mode", path);
            response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding("UTF-8");

            String reason = maintenanceModeService.getMaintenanceReason();
            String message = (reason != null && !reason.isBlank())
                    ? reason
                    : "Database maintenance and restore is currently in progress. Please wait a few moments.";

            ApiErrorResponse error = ApiErrorResponse.builder()
                    .success(false)
                    .code("MAINTENANCE_MODE")
                    .message(message)
                    .timestamp(Instant.now())
                    .build();

            response.getWriter().write(objectMapper.writeValueAsString(error));
            return;
        }

        filterChain.doFilter(request, response);
    }
}
