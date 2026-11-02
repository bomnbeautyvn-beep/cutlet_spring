package com.cutletspring.badge;

import com.cutletspring.badge.controller.AdminBadgeController;
import com.cutletspring.badge.dto.BadgeRequest;
import com.cutletspring.badge.dto.BadgeResponse;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class AdminBadgeControllerTests {

    @Autowired
    private AdminBadgeController adminBadgeController;

    @Test
    @DisplayName("Admin lists all badges and verifies seeded Atelier badges")
    void testListAllBadges() {
        ResponseEntity<ApiResponse<List<BadgeResponse>>> response = adminBadgeController.getAllBadges();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        List<BadgeResponse> badges = response.getBody().getData();
        assertNotNull(badges);
        assertTrue(badges.size() >= 4);

        // Verify standard seeded badges exist
        assertTrue(badges.stream().anyMatch(b -> b.getId().equals("chef-signature")));
        assertTrue(badges.stream().anyMatch(b -> b.getId().equals("best-seller")));
        assertTrue(badges.stream().anyMatch(b -> b.getId().equals("limited-batch")));
        assertTrue(badges.stream().anyMatch(b -> b.getId().equals("spicy-glaze")));
    }

    @Test
    @DisplayName("Admin creates a new badge, updates it, toggles status, and verifies delete safety")
    void testBadgeLifecycleAndSafety() {
        // 1. Create a unique badge
        BadgeRequest createReq = BadgeRequest.builder()
                .code("weekend-edition")
                .name("Weekend Edition")
                .nameVi("Phiên Bản Cuối Tuần")
                .nameKr("주말 한정")
                .nameJp("週末限定")
                .description("Special weekend-only dining preparation")
                .badgeColor("#835500")
                .icon("weekend")
                .displayOrder(10)
                .active(true)
                .build();

        ResponseEntity<ApiResponse<BadgeResponse>> createdResp = adminBadgeController.createBadge(createReq);
        assertEquals(201, createdResp.getStatusCode().value());
        BadgeResponse created = createdResp.getBody().getData();
        assertEquals("weekend-edition", created.getId());
        assertEquals("Weekend Edition", created.getName());
        assertEquals("#835500", created.getBadgeColor());

        // 2. Prevent duplicate code creation
        assertThrows(ConflictException.class, () -> adminBadgeController.createBadge(createReq));

        // 3. Update the badge
        BadgeRequest updateReq = BadgeRequest.builder()
                .code("weekend-edition")
                .name("Weekend Prime Edition")
                .nameVi("Phiên Bản Cuối Tuần Cao Cấp")
                .nameKr("주말 프리미엄")
                .nameJp("週末プレミアム")
                .description("Updated description")
                .badgeColor("#a87900")
                .icon("star")
                .displayOrder(11)
                .active(true)
                .build();

        ResponseEntity<ApiResponse<BadgeResponse>> updatedResp = adminBadgeController.updateBadge(created.getId(), updateReq);
        assertEquals(200, updatedResp.getStatusCode().value());
        assertEquals("Weekend Prime Edition", updatedResp.getBody().getData().getName());

        // 4. Toggle active status
        ResponseEntity<ApiResponse<BadgeResponse>> toggleResp = adminBadgeController.setBadgeStatus(created.getId(), Map.of("active", false));
        assertEquals(200, toggleResp.getStatusCode().value());
        assertFalse(toggleResp.getBody().getData().isActive());

        // 5. Delete the unassigned badge
        ResponseEntity<ApiResponse<Void>> deleteResp = adminBadgeController.deleteBadge(created.getId());
        assertEquals(200, deleteResp.getStatusCode().value());

        // 6. Verify deleting an assigned badge is rejected safely
        assertThrows(ConflictException.class, () -> adminBadgeController.deleteBadge("chef-signature"));
    }
}

