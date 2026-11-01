package com.cutletspring.restaurant;

import com.cutletspring.restaurant.controller.AdminRestaurantSettingsController;
import com.cutletspring.restaurant.controller.RestaurantSettingsController;
import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.dto.UpdateRestaurantSettingsRequest;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class RestaurantSettingsControllerTests {

    @Autowired
    private RestaurantSettingsController publicController;

    @Autowired
    private AdminRestaurantSettingsController adminController;

    @Test
    @DisplayName("Public user can retrieve restaurant settings with all 4 languages")
    void testGetPublicSettings() {
        ResponseEntity<ApiResponse<RestaurantSettingsDto>> response = publicController.getPublicSettings();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        RestaurantSettingsDto data = response.getBody().getData();
        assertNotNull(data);
        assertTrue(data.getNameEn().contains("CUTLET SPRING"));
        assertNotNull(data.getNameKr());
        assertNotNull(data.getNameVi());
        assertNotNull(data.getNameJp());
        assertEquals("039 376 2717", data.getPhoneNumber());
        assertEquals("11:00", data.getOpeningHourLunchStart());
        assertEquals("20:30", data.getLastOrderTime());
    }

    @Test
    @DisplayName("Admin can update restaurant settings")
    void testUpdateRestaurantSettings() {
        var auth = new UsernamePasswordAuthenticationToken(
                "admin@cutletspring.com",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        UpdateRestaurantSettingsRequest request = UpdateRestaurantSettingsRequest.builder()
                .nameEn("CUTLET SPRING ATELIER")
                .nameKr("봄돈까스 아틀리에")
                .nameVi("Cutlet Spring Xưởng Nghệ Thuật")
                .nameJp("カツスプリング アトリエ")
                .sloganEn("Handcrafted Tonkatsu")
                .addressEn("6A Street 9, Thao Dien")
                .addressKr("타오디엔 9번가 6A")
                .addressVi("6A Đường số 9, Thảo Điền")
                .addressJp("タオディエン9番通り6A")
                .phoneNumber("039 376 2717")
                .email("contact@cutletspring.com")
                .openingHourLunchStart("11:00")
                .openingHourLunchEnd("15:00")
                .openingHourDinnerStart("17:00")
                .openingHourDinnerEnd("21:00")
                .lastOrderTime("20:30")
                .vatRate(new BigDecimal("8.00"))
                .defaultPrepMinutes(20)
                .capacityHall(32)
                .capacityCounter(12)
                .build();

        ResponseEntity<ApiResponse<RestaurantSettingsDto>> response = adminController.updateSettings(request, auth);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertEquals("CUTLET SPRING ATELIER", response.getBody().getData().getNameEn());
        assertEquals(32, response.getBody().getData().getCapacityHall());

        // Restore to default for subsequent tests
        request.setNameEn("CUTLET SPRING");
        request.setCapacityHall(30);
        request.setCapacityCounter(10);
        adminController.updateSettings(request, auth);
    }
}
