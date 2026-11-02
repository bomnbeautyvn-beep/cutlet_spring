package com.cutletspring.database.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Service
public class MaintenanceModeServiceImpl implements MaintenanceModeService {

    private final AtomicBoolean maintenanceMode = new AtomicBoolean(false);
    private final AtomicReference<String> maintenanceReason = new AtomicReference<>(null);

    @Override
    public boolean isMaintenanceMode() {
        return maintenanceMode.get();
    }

    @Override
    public void setMaintenanceMode(boolean active, String reason) {
        maintenanceMode.set(active);
        maintenanceReason.set(active ? reason : null);
        if (active) {
            log.warn("Database Maintenance Mode ENABLED. Reason: {}", reason);
        } else {
            log.info("Database Maintenance Mode DISABLED. Normal operations resumed.");
        }
    }

    @Override
    public String getMaintenanceReason() {
        return maintenanceReason.get();
    }
}
