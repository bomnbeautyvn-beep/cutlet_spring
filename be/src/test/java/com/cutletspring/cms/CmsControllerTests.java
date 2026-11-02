package com.cutletspring.cms;

import com.cutletspring.cms.controller.AdminCmsController;
import com.cutletspring.cms.controller.CmsPublicController;
import com.cutletspring.cms.dto.*;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class CmsControllerTests {

    @Autowired
    private CmsPublicController publicController;

    @Autowired
    private AdminCmsController adminController;

    private UserDetails setupAdminAuth() {
        UserDetails admin = User.builder()
                .username("admin@cutletspring.com")
                .password("testpass")
                .roles("ADMIN")
                .build();
        var auth = new UsernamePasswordAuthenticationToken(
                admin,
                null,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        SecurityContextHolder.getContext().setAuthentication(auth);
        return admin;
    }

    @Test
    @DisplayName("Public user can fetch consolidated homepage payload")
    void testGetPublicHomepageData() {
        ResponseEntity<ApiResponse<HomepagePublicResponse>> response = publicController.getHomepage();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());

        HomepagePublicResponse data = response.getBody().getData();
        assertNotNull(data);

        // Verify sections
        assertNotNull(data.getSections());
        assertFalse(data.getSections().isEmpty());
        assertTrue(data.getSections().stream().anyMatch(s -> "hero".equals(s.getSectionKey())));
        assertTrue(data.getSections().stream().anyMatch(s -> "ingredients".equals(s.getSectionKey())));

        // Verify hero content
        assertNotNull(data.getHero());
        assertEquals("The Art of Hand Crafted Cutlets", data.getHero().getTitleEn());
        assertNotNull(data.getHero().getTitleKr());
        assertNotNull(data.getHero().getTitleVi());
        assertNotNull(data.getHero().getTitleJp());

        // Verify 4 atelier ingredients
        assertNotNull(data.getIngredients());
        assertEquals(4, data.getIngredients().size());
        assertTrue(data.getIngredients().stream().anyMatch(i -> "chilled-pork".equals(i.getId())));
        assertTrue(data.getIngredients().stream().anyMatch(i -> "breadcrumbs".equals(i.getId())));

        // Verify reviews summary & featured reviews
        assertNotNull(data.getReviewsSummary());
        assertEquals(562, data.getReviewsSummary().getTotalReviewsCount());
        assertNotNull(data.getReviews());
        assertFalse(data.getReviews().isEmpty());
        assertTrue(data.getReviews().stream().anyMatch(r -> r.getOwnerResponse() != null));

        // Verify restaurant & header-footer
        assertNotNull(data.getRestaurant());
        assertNotNull(data.getHeaderFooter());
        assertEquals("039 376 2717", data.getHeaderFooter().getPhoneNumber());
        assertTrue(data.getHeaderFooter().getHotlineVisible());
    }

    @Test
    @DisplayName("Public user can fetch ingredients and reviews individually")
    void testGetPublicIndividualEndpoints() {
        ResponseEntity<ApiResponse<List<IngredientDto>>> ingResponse = publicController.getIngredients();
        assertNotNull(ingResponse);
        assertEquals(4, ingResponse.getBody().getData().size());

        ResponseEntity<ApiResponse<List<GoogleReviewDto>>> revResponse = publicController.getReviews();
        assertNotNull(revResponse);
        assertFalse(revResponse.getBody().getData().isEmpty());

        ResponseEntity<ApiResponse<GoogleReviewsSummaryDto>> summaryResponse = publicController.getReviewsSummary();
        assertNotNull(summaryResponse);
        assertNotNull(summaryResponse.getBody().getData().getAverageRating());

        ResponseEntity<ApiResponse<HeaderFooterDto>> hfResponse = publicController.getHeaderFooter();
        assertNotNull(hfResponse);
        assertNotNull(hfResponse.getBody().getData().getBrandNameEn());
    }

    @Test
    @DisplayName("Admin can update homepage hero content")
    void testAdminHeroOperations() {
        UserDetails admin = setupAdminAuth();

        ResponseEntity<ApiResponse<HomepageHeroDto>> heroResp = adminController.getHero();
        assertNotNull(heroResp);
        assertEquals("The Art of Hand Crafted Cutlets", heroResp.getBody().getData().getTitleEn());

        UpdateHomepageHeroRequest updateRequest = UpdateHomepageHeroRequest.builder()
                .titleEn("The Art of Hand Crafted Cutlets - Updated")
                .titleKr("장인정신으로 빚어낸 수제 돈카츠의 미학")
                .titleVi("Nghệ Thuật Tonkatsu Thủ Công")
                .titleJp("職人技が紡ぐ手作りとんかつの芸術")
                .headlineEn("Precision Fried Golden Tonkatsu")
                .headlineKr("타협 없는 정통 기법의 황금빛 돈카츠")
                .headlineVi("Tonkatsu Hoàng Kim Chiên Chuẩn Xác")
                .headlineJp("黄金色に輝く極上とんかつ")
                .taglineEn("Uncompromising Craftsmanship")
                .taglineKr("타협하지 않는 원재료와 장인정신")
                .taglineVi("Nguyên liệu chuẩn mực và tinh thần nghệ nhân")
                .taglineJp("妥協なき厳選素材と職人魂")
                .descriptionEn("120-hour wet-aged chilled pork precision-fried to perfection.")
                .descriptionKr("120시간 저온 습식숙성 프리미엄 원육 황금빛 돈카츠.")
                .descriptionVi("Thịt heo mát ủ ẩm 120 giờ chiên vàng chuẩn xác.")
                .descriptionJp("120時間熟成チルドポークのとんかつ。")
                .ctaTextEn("Explore Menu Now")
                .ctaTextKr("지금 메뉴 보기")
                .ctaTextVi("Xem Thực Đơn Ngay")
                .ctaTextJp("今すぐメニューを見る")
                .ctaTarget("menu")
                .isActive(true)
                .build();

        ResponseEntity<ApiResponse<HomepageHeroDto>> updated = adminController.updateHero(updateRequest, admin);
        assertNotNull(updated);
        assertEquals("The Art of Hand Crafted Cutlets - Updated", updated.getBody().getData().getTitleEn());
    }

    @Test
    @DisplayName("Admin can manage ingredients: create, update, toggle status, and delete")
    void testAdminIngredientLifecycle() {
        UserDetails admin = setupAdminAuth();

        SaveIngredientRequest newIng = SaveIngredientRequest.builder()
                .id("sesame-oil")
                .nameEn("Artisanal Sesame Oil")
                .nameKr("전통 참기름")
                .nameVi("Dầu Mè Thủ Công")
                .nameJp("純正ごま油")
                .subtitleEn("Cold Pressed")
                .subtitleKr("저온 압착")
                .subtitleVi("Ép lạnh nguyên chất")
                .subtitleJp("低温圧搾")
                .descriptionEn("Fragrant cold-pressed sesame oil used in dipping sauces.")
                .descriptionKr("저온 압착 방식으로 착유한 고소한 전통 참기름.")
                .descriptionVi("Dầu mè ép lạnh thơm bùi dùng cho nước sốt chấm.")
                .descriptionJp("伝統製法で搾った香り高い純正ごま油。")
                .displayOrder(5)
                .isActive(true)
                .build();

        ResponseEntity<ApiResponse<IngredientDto>> created = adminController.createIngredient(newIng, admin);
        assertNotNull(created);
        assertEquals("sesame-oil", created.getBody().getData().getId());

        ResponseEntity<ApiResponse<IngredientDto>> toggled = adminController.toggleIngredientStatus("sesame-oil", admin);
        assertNotNull(toggled);
        assertFalse(toggled.getBody().getData().getIsActive());

        ResponseEntity<ApiResponse<Void>> deleted = adminController.deleteIngredient("sesame-oil", admin);
        assertNotNull(deleted);
        assertEquals(200, deleted.getStatusCode().value());
    }

    @Test
    @DisplayName("Admin creates ingredient with ONLY English fields (VI, KO, JA optional)")
    void testCreateIngredient_withOnlyEnglish_succeeds() {
        UserDetails admin = setupAdminAuth();

        SaveIngredientRequest newIng = SaveIngredientRequest.builder()
                .id("en-only-flour")
                .nameEn("Organic Wheat Flour")
                .descriptionEn("High protein organic flour imported directly from Hokkaido.")
                .displayOrder(6)
                .isActive(true)
                .build();

        ResponseEntity<ApiResponse<IngredientDto>> created = adminController.createIngredient(newIng, admin);
        assertNotNull(created);
        assertEquals("en-only-flour", created.getBody().getData().getId());
        assertEquals("Organic Wheat Flour", created.getBody().getData().getNameEn());
        assertNull(created.getBody().getData().getNameVi());
        assertNull(created.getBody().getData().getNameKr());
        assertNull(created.getBody().getData().getNameJp());

        // Clean up
        ResponseEntity<ApiResponse<Void>> deleted = adminController.deleteIngredient("en-only-flour", admin);
        assertNotNull(deleted);
        assertEquals(200, deleted.getStatusCode().value());
    }

    @Test
    @DisplayName("Admin can manage Google reviews: create, update, toggle featured, and delete")
    void testAdminGoogleReviewLifecycle() {
        UserDetails admin = setupAdminAuth();

        SaveGoogleReviewRequest newReview = SaveGoogleReviewRequest.builder()
                .id("rev-test-1")
                .reviewerName("Test Diner")
                .reviewerInitials("TD")
                .rating(5)
                .reviewLanguage("EN")
                .reviewContent("Crispy hire katsu melted in mouth! Amazing craft.")
                .reviewDate("Yesterday")
                .ownerResponse("Thank you for visiting Cutlet Spring!")
                .ownerResponseDate("Today")
                .isFeatured(true)
                .isActive(true)
                .build();

        ResponseEntity<ApiResponse<GoogleReviewDto>> created = adminController.createReview(newReview, admin);
        assertNotNull(created);
        assertEquals("rev-test-1", created.getBody().getData().getId());

        ResponseEntity<ApiResponse<GoogleReviewDto>> toggledFeatured = adminController.toggleReviewFeatured("rev-test-1", admin);
        assertNotNull(toggledFeatured);
        assertFalse(toggledFeatured.getBody().getData().getIsFeatured());

        ResponseEntity<ApiResponse<Void>> deleted = adminController.deleteReview("rev-test-1", admin);
        assertNotNull(deleted);
        assertEquals(200, deleted.getStatusCode().value());
    }

    @Test
    @DisplayName("Admin can reorder homepage sections")
    void testAdminSectionReordering() {
        UserDetails admin = setupAdminAuth();

        List<String> reorderedKeys = List.of("sec-hero", "sec-ingredients", "sec-reviews", "sec-location", "sec-info");
        ResponseEntity<ApiResponse<List<HomepageSectionDto>>> response = adminController.reorderSections(reorderedKeys, admin);
        assertNotNull(response);
        assertEquals(5, response.getBody().getData().size());
    }
}
