package com.cutletspring.restaurant.repository;

import com.cutletspring.restaurant.entity.RestaurantSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantSettingsRepository extends JpaRepository<RestaurantSettings, String> {

    default Optional<RestaurantSettings> findDefault() {
        return findById("default");
    }
}

