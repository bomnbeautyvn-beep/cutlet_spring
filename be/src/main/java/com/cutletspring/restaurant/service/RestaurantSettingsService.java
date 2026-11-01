package com.cutletspring.restaurant.service;

import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.dto.UpdateRestaurantSettingsRequest;
import org.springframework.web.multipart.MultipartFile;

public interface RestaurantSettingsService {

    RestaurantSettingsDto getSettings();

    RestaurantSettingsDto updateSettings(UpdateRestaurantSettingsRequest request, String adminEmail);

    RestaurantSettingsDto uploadLogo(MultipartFile file, String adminEmail);

    RestaurantSettingsDto uploadBanner(MultipartFile file, String adminEmail);
}
