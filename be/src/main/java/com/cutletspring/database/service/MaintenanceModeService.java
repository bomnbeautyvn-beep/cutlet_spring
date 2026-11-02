package com.cutletspring.database.service;

public interface MaintenanceModeService {

    boolean isMaintenanceMode();

    void setMaintenanceMode(boolean active, String reason);

    String getMaintenanceReason();
}
