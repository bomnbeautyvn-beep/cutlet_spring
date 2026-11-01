package com.cutletspring.menu;

import com.cutletspring.menu.controller.AdminMenuController;
import com.cutletspring.menu.dto.MenuItemRequest;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.dto.MenuStatusUpdateRequest;
import com.cutletspring.menu.service.MenuItemService;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class AdminMenuControllerTests {

    @Autowired
    private AdminMenuController adminMenuController;

    @Autowired
    private MenuItemService menuItemService;

    @Test
    @DisplayName("Admin retrieves paginated dishes")
    void testAdminMenuPagination() {
        ResponseEntity<ApiResponse<Page<MenuItemResponse>>> response = adminMenuController.getAdminMenuItems(null, null, 0, 10);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        Page<MenuItemResponse> page = response.getBody().getData();
        assertNotNull(page);
        assertEquals(10, page.getContent().size());
        assertTrue(page.getTotalElements() >= 38);
    }

    @Test
    @DisplayName("Admin updates dish visibility explicitly and toggles")
    void testToggleActive() {
        // Explicit status update
        ResponseEntity<ApiResponse<MenuItemResponse>> statusResp = adminMenuController.updateStatus(
                "half-and-half-pork-cutlet",
                new MenuStatusUpdateRequest(false)
        );
        assertNotNull(statusResp);
        assertEquals(200, statusResp.getStatusCode().value());
        assertFalse(statusResp.getBody().getData().isActive());

        // Toggle back
        ResponseEntity<ApiResponse<MenuItemResponse>> response = adminMenuController.toggleActive("half-and-half-pork-cutlet");
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        MenuItemResponse updated = response.getBody().getData();
        assertNotNull(updated);
        assertEquals("half-and-half-pork-cutlet", updated.getId());
        assertTrue(updated.isActive());
    }

    @Test
    @DisplayName("Admin creates and deletes new menu dish with mandatory 4 languages")
    void testCreateAndDeleteMenuItem() {
        MenuItemRequest request = MenuItemRequest.builder()
                .id("test-truffle-katsu")
                .categoryId("japanese")
                .nameEn("Truffle Tenderloin Katsu")
                .nameKr("트러플 안심카츠")
                .nameVi("Katsu Thăn Nội Truffle")
                .nameJp("トリュフヒレカツ")
                .descriptionEn("Special seasonal tonkatsu with real black truffle oil.")
                .descriptionKr("신선한 블랙 트러플 오일을 곁들인 프리미엄 안심카츠.")
                .descriptionVi("Món tonkatsu theo mùa đặc biệt cùng dầu nấm truffle đen thượng hạng.")
                .descriptionJp("本物の黒トリュフオイルを添えた季節限定のプレミアムヒレカツ。")
                .portionEn("1 serving (6 pieces)")
                .portionKr("1인분 (6조각)")
                .portionVi("Phần 1 người (6 miếng)")
                .portionJp("1人前 (6個)")
                .basePrice(290)
                .prepTimeMinutes(18)
                .active(true)
                .build();

        ResponseEntity<ApiResponse<MenuItemResponse>> createResponse = adminMenuController.createMenuItem(request);
        assertNotNull(createResponse);
        assertEquals(201, createResponse.getStatusCode().value());
        MenuItemResponse created = createResponse.getBody().getData();
        assertNotNull(created);
        assertEquals("test-truffle-katsu", created.getId());
        assertEquals("Truffle Tenderloin Katsu", created.getNameEn());
        assertEquals("Katsu Thăn Nội Truffle", created.getNameVi());
        assertEquals("トリュフヒレカツ", created.getNameJp());
        assertEquals("Phần 1 người (6 miếng)", created.getPortionVi());
        assertEquals(290, created.getPrice());

        // Clean up
        ResponseEntity<ApiResponse<Void>> deleteResponse = adminMenuController.deleteMenuItem("test-truffle-katsu");
        assertNotNull(deleteResponse);
        assertEquals(200, deleteResponse.getStatusCode().value());
    }
}
