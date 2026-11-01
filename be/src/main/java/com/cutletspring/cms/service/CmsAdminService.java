package com.cutletspring.cms.service;

import com.cutletspring.cms.dto.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CmsAdminService {

    // 1. SECTIONS
    List<HomepageSectionDto> getAllSections();

    HomepageSectionDto updateSection(String id, UpdateHomepageSectionRequest request, String adminEmail);

    List<HomepageSectionDto> reorderSections(List<String> sectionIds, String adminEmail);

    // 2. HERO & INTRODUCTION
    HomepageHeroDto getHero();

    HomepageHeroDto updateHero(UpdateHomepageHeroRequest request, String adminEmail);

    HomepageHeroDto uploadHeroImage(MultipartFile file, String adminEmail);

    // 3. INGREDIENTS
    List<IngredientDto> getAllIngredients();

    IngredientDto getIngredient(String id);

    IngredientDto createIngredient(SaveIngredientRequest request, String adminEmail);

    IngredientDto updateIngredient(String id, SaveIngredientRequest request, String adminEmail);

    IngredientDto toggleIngredientStatus(String id, String adminEmail);

    void deleteIngredient(String id, String adminEmail);

    IngredientDto uploadIngredientImage(String id, MultipartFile file, String adminEmail);

    // 4. GOOGLE REVIEWS
    List<GoogleReviewDto> getAllReviews();

    GoogleReviewDto getReview(String id);

    GoogleReviewDto createReview(SaveGoogleReviewRequest request, String adminEmail);

    GoogleReviewDto updateReview(String id, SaveGoogleReviewRequest request, String adminEmail);

    GoogleReviewDto toggleReviewStatus(String id, String adminEmail);

    GoogleReviewDto toggleReviewFeatured(String id, String adminEmail);

    void deleteReview(String id, String adminEmail);

    // 5. HEADER & FOOTER SETTINGS
    HeaderFooterDto getHeaderFooter();

    HeaderFooterDto updateHeaderFooter(UpdateHeaderFooterRequest request, String adminEmail);

    HeaderFooterDto uploadLogo(MultipartFile file, String adminEmail);
}
