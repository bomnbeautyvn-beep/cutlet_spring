package com.cutletspring.menu;

import com.cutletspring.menu.controller.AdminMenuController;
import com.cutletspring.menu.dto.MenuItemRequest;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.dto.MenuStatusUpdateRequest;
import com.cutletspring.menu.service.MenuItemService;
import com.cutletspring.shared.response.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    @DisplayName("Admin updates dish attributes and verifies database persistence and JSON response")
    void testUpdateDishBadgePersistence() {
        String testId = "spring-signature-set";
        
        // 1. Fetch current item
        MenuItemResponse current = adminMenuController.getAdminMenuItemById(testId).getBody().getData();
        assertNotNull(current);

        // 2. Build update request with all 4 attributes toggled
        MenuItemRequest request = MenuItemRequest.builder()
                .categoryId(current.getCategory())
                .nameEn(current.getNameEn())
                .nameKr(current.getNameKr())
                .nameVi(current.getNameVi())
                .nameJp(current.getNameJp())
                .descriptionEn(current.getDescriptionEn())
                .descriptionKr(current.getDescriptionKr())
                .descriptionVi(current.getDescriptionVi())
                .descriptionJp(current.getDescriptionJp())
                .portionEn(current.getPortionEn())
                .portionKr(current.getPortionKr())
                .portionVi(current.getPortionVi())
                .portionJp(current.getPortionJp())
                .basePrice(current.getPrice())
                .prepTimeMinutes(current.getPrepTimeMinutes())
                .isChefSignature(true)
                .isBestSeller(true)
                .isLimited(true)
                .isSpicy(true)
                .active(true)
                .build();

        // 3. Perform update
        ResponseEntity<ApiResponse<MenuItemResponse>> updateResponse = adminMenuController.updateMenuItem(testId, request);
        assertNotNull(updateResponse);
        assertEquals(200, updateResponse.getStatusCode().value());
        MenuItemResponse updated = updateResponse.getBody().getData();
        assertNotNull(updated);

        // Verify response contains true for all 4 attributes (both formats)
        assertTrue(updated.isChefSignature());
        assertTrue(updated.isBestSeller());
        assertTrue(updated.isLimited());
        assertTrue(updated.isSpicy());
        assertTrue(updated.getChefSignatureAlias());
        assertTrue(updated.getBestSellerAlias());
        assertTrue(updated.getLimitedAlias());
        assertTrue(updated.getSpicyAlias());

        // 4. Verify directly in repository / database
        MenuItemResponse reloaded = adminMenuController.getAdminMenuItemById(testId).getBody().getData();
        assertTrue(reloaded.isChefSignature());
        assertTrue(reloaded.isBestSeller());
        assertTrue(reloaded.isLimited());
        assertTrue(reloaded.isSpicy());

        // 5. Restore original state
        MenuItemRequest restoreReq = MenuItemRequest.builder()
                .categoryId(current.getCategory())
                .nameEn(current.getNameEn())
                .nameKr(current.getNameKr())
                .nameVi(current.getNameVi())
                .nameJp(current.getNameJp())
                .descriptionEn(current.getDescriptionEn())
                .descriptionKr(current.getDescriptionKr())
                .descriptionVi(current.getDescriptionVi())
                .descriptionJp(current.getDescriptionJp())
                .portionEn(current.getPortionEn())
                .portionKr(current.getPortionKr())
                .portionVi(current.getPortionVi())
                .portionJp(current.getPortionJp())
                .basePrice(current.getPrice())
                .prepTimeMinutes(current.getPrepTimeMinutes())
                .isChefSignature(current.isChefSignature())
                .isBestSeller(current.isBestSeller())
                .isLimited(current.isLimited())
                .isSpicy(current.isSpicy())
                .active(current.isActive())
                .build();
        adminMenuController.updateMenuItem(testId, restoreReq);
    }

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

    @Test
    @DisplayName("Admin creates menu item with ONLY English fields (VI, KO, JA optional)")
    void testCreateMenuItem_withOnlyEnglish_succeeds() {
        MenuItemRequest request = MenuItemRequest.builder()
                .id("test-en-only-katsu")
                .categoryId("japanese")
                .nameEn("English Only Special Katsu")
                .descriptionEn("Crispy tenderloin cutlet with only English translations provided.")
                .basePrice(250)
                .prepTimeMinutes(15)
                .active(true)
                .build();

        ResponseEntity<ApiResponse<MenuItemResponse>> createResponse = adminMenuController.createMenuItem(request);
        assertNotNull(createResponse);
        assertEquals(201, createResponse.getStatusCode().value());
        MenuItemResponse created = createResponse.getBody().getData();
        assertNotNull(created);
        assertEquals("test-en-only-katsu", created.getId());
        assertEquals("English Only Special Katsu", created.getNameEn());
        assertNull(created.getNameVi());
        assertNull(created.getNameKr());
        assertNull(created.getNameJp());

        // Clean up
        ResponseEntity<ApiResponse<Void>> deleteResponse = adminMenuController.deleteMenuItem("test-en-only-katsu");
        assertNotNull(deleteResponse);
        assertEquals(200, deleteResponse.getStatusCode().value());
    }
}
