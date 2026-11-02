package com.cutletspring.cms.service;

import com.cutletspring.account.service.AccountAuditLogService;
import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import com.cutletspring.cloudinary.service.CloudinaryService;
import com.cutletspring.cms.dto.*;
import com.cutletspring.cms.entity.GoogleReview;
import com.cutletspring.cms.entity.HomepageHeroContent;
import com.cutletspring.cms.entity.HomepageSection;
import com.cutletspring.cms.entity.Ingredient;
import com.cutletspring.cms.mapper.CmsMapper;
import com.cutletspring.cms.repository.GoogleReviewRepository;
import com.cutletspring.cms.repository.HomepageHeroContentRepository;
import com.cutletspring.cms.repository.HomepageSectionRepository;
import com.cutletspring.cms.repository.IngredientRepository;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import com.cutletspring.restaurant.repository.RestaurantSettingsRepository;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CmsAdminServiceImpl implements CmsAdminService {

    private final HomepageSectionRepository sectionRepository;
    private final HomepageHeroContentRepository heroContentRepository;
    private final IngredientRepository ingredientRepository;
    private final GoogleReviewRepository googleReviewRepository;
    private final RestaurantSettingsRepository settingsRepository;
    private final CmsMapper cmsMapper;
    private final CloudinaryService cloudinaryService;
    private final AccountAuditLogService auditLogService;

    // =========================================================================
    // 1. SECTIONS
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public List<HomepageSectionDto> getAllSections() {
        return sectionRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();
    }

    @Override
    @Transactional
    public HomepageSectionDto updateSection(String id, UpdateHomepageSectionRequest request, String adminEmail) {
        HomepageSection section = sectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Homepage section not found with id: " + id));

        section.setTitleEn(request.getTitleEn().trim());
        section.setTitleKr(request.getTitleKr().trim());
        section.setTitleVi(request.getTitleVi().trim());
        section.setTitleJp(request.getTitleJp().trim());

        section.setSubtitleEn(request.getSubtitleEn());
        section.setSubtitleKr(request.getSubtitleKr());
        section.setSubtitleVi(request.getSubtitleVi());
        section.setSubtitleJp(request.getSubtitleJp());

        if (request.getDisplayOrder() != null) {
            section.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getIsActive() != null) {
            section.setIsActive(request.getIsActive());
        }

        section.setUpdatedAt(Instant.now());
        HomepageSection saved = sectionRepository.save(section);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_HOMEPAGE_SECTION",
                "HOMEPAGE_SECTION",
                saved.getId(),
                "Updated section '" + saved.getSectionKey() + "' visibility and labels",
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public List<HomepageSectionDto> reorderSections(List<String> sectionIds, String adminEmail) {
        for (int i = 0; i < sectionIds.size(); i++) {
            String sectionId = sectionIds.get(i);
            int order = i + 1;
            sectionRepository.findById(sectionId).ifPresent(sec -> {
                sec.setDisplayOrder(order);
                sec.setUpdatedAt(Instant.now());
                sectionRepository.save(sec);
            });
        }

        auditLogService.record(
                adminEmail,
                null,
                "REORDER_HOMEPAGE_SECTIONS",
                "HOMEPAGE_SECTION",
                "bulk",
                "Reordered " + sectionIds.size() + " homepage sections",
                null
        );

        return getAllSections();
    }

    // =========================================================================
    // 2. HERO & INTRODUCTION
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public HomepageHeroDto getHero() {
        HomepageHeroContent hero = heroContentRepository.findDefaultHero()
                .orElseGet(() -> heroContentRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No homepage hero content found")));
        return cmsMapper.toDto(hero);
    }

    @Override
    @Transactional
    public HomepageHeroDto updateHero(UpdateHomepageHeroRequest request, String adminEmail) {
        HomepageHeroContent hero = heroContentRepository.findDefaultHero()
                .orElseGet(() -> heroContentRepository.findAll().stream().findFirst()
                        .orElseGet(() -> HomepageHeroContent.builder()
                                .id("default-hero")
                                .build()));

        hero.setTitleEn(request.getTitleEn().trim());
        hero.setTitleKr(request.getTitleKr().trim());
        hero.setTitleVi(request.getTitleVi().trim());
        hero.setTitleJp(request.getTitleJp().trim());

        hero.setHeadlineEn(request.getHeadlineEn().trim());
        hero.setHeadlineKr(request.getHeadlineKr().trim());
        hero.setHeadlineVi(request.getHeadlineVi().trim());
        hero.setHeadlineJp(request.getHeadlineJp().trim());

        hero.setTaglineEn(request.getTaglineEn());
        hero.setTaglineKr(request.getTaglineKr());
        hero.setTaglineVi(request.getTaglineVi());
        hero.setTaglineJp(request.getTaglineJp());

        hero.setDescriptionEn(request.getDescriptionEn().trim());
        hero.setDescriptionKr(request.getDescriptionKr().trim());
        hero.setDescriptionVi(request.getDescriptionVi().trim());
        hero.setDescriptionJp(request.getDescriptionJp().trim());

        hero.setCtaTextEn(request.getCtaTextEn().trim());
        hero.setCtaTextKr(request.getCtaTextKr().trim());
        hero.setCtaTextVi(request.getCtaTextVi().trim());
        hero.setCtaTextJp(request.getCtaTextJp().trim());

        if (request.getCtaTarget() != null && !request.getCtaTarget().isBlank()) {
            hero.setCtaTarget(request.getCtaTarget().trim());
        }

        if (request.getBadgeTextEn() != null) hero.setBadgeTextEn(request.getBadgeTextEn());
        if (request.getBadgeTextKr() != null) hero.setBadgeTextKr(request.getBadgeTextKr());
        if (request.getBadgeTextVi() != null) hero.setBadgeTextVi(request.getBadgeTextVi());
        if (request.getBadgeTextJp() != null) hero.setBadgeTextJp(request.getBadgeTextJp());

        if (request.getDishTitleEn() != null) hero.setDishTitleEn(request.getDishTitleEn());
        if (request.getDishTitleKr() != null) hero.setDishTitleKr(request.getDishTitleKr());
        if (request.getDishTitleVi() != null) hero.setDishTitleVi(request.getDishTitleVi());
        if (request.getDishTitleJp() != null) hero.setDishTitleJp(request.getDishTitleJp());

        if (request.getDishDescEn() != null) hero.setDishDescEn(request.getDishDescEn());
        if (request.getDishDescKr() != null) hero.setDishDescKr(request.getDishDescKr());
        if (request.getDishDescVi() != null) hero.setDishDescVi(request.getDishDescVi());
        if (request.getDishDescJp() != null) hero.setDishDescJp(request.getDishDescJp());

        if (request.getMetric1Value() != null) hero.setMetric1Value(request.getMetric1Value());
        if (request.getMetric1LabelEn() != null) hero.setMetric1LabelEn(request.getMetric1LabelEn());
        if (request.getMetric1LabelKr() != null) hero.setMetric1LabelKr(request.getMetric1LabelKr());
        if (request.getMetric1LabelVi() != null) hero.setMetric1LabelVi(request.getMetric1LabelVi());
        if (request.getMetric1LabelJp() != null) hero.setMetric1LabelJp(request.getMetric1LabelJp());

        if (request.getMetric2Value() != null) hero.setMetric2Value(request.getMetric2Value());
        if (request.getMetric2LabelEn() != null) hero.setMetric2LabelEn(request.getMetric2LabelEn());
        if (request.getMetric2LabelKr() != null) hero.setMetric2LabelKr(request.getMetric2LabelKr());
        if (request.getMetric2LabelVi() != null) hero.setMetric2LabelVi(request.getMetric2LabelVi());
        if (request.getMetric2LabelJp() != null) hero.setMetric2LabelJp(request.getMetric2LabelJp());

        if (request.getMetric3Value() != null) hero.setMetric3Value(request.getMetric3Value());
        if (request.getMetric3LabelEn() != null) hero.setMetric3LabelEn(request.getMetric3LabelEn());
        if (request.getMetric3LabelKr() != null) hero.setMetric3LabelKr(request.getMetric3LabelKr());
        if (request.getMetric3LabelVi() != null) hero.setMetric3LabelVi(request.getMetric3LabelVi());
        if (request.getMetric3LabelJp() != null) hero.setMetric3LabelJp(request.getMetric3LabelJp());

        if (request.getIsActive() != null) {
            hero.setIsActive(request.getIsActive());
        }

        hero.setUpdatedAt(Instant.now());
        HomepageHeroContent saved = heroContentRepository.save(hero);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_HOMEPAGE_HERO",
                "HOMEPAGE_HERO",
                saved.getId(),
                "Updated homepage hero titles, taglines, and metrics",
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public HomepageHeroDto uploadHeroImage(MultipartFile file, String adminEmail) {
        HomepageHeroContent hero = heroContentRepository.findDefaultHero()
                .orElseGet(() -> heroContentRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No homepage hero content found")));

        if (hero.getImagePublicId() != null && !hero.getImagePublicId().isBlank()) {
            cloudinaryService.deleteImage(hero.getImagePublicId());
        }

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file);
        hero.setImageUrl(result.getSecureUrl());
        hero.setImagePublicId(result.getPublicId());
        hero.setUpdatedAt(Instant.now());

        HomepageHeroContent saved = heroContentRepository.save(hero);

        auditLogService.record(
                adminEmail,
                null,
                "UPLOAD_HERO_IMAGE",
                "HOMEPAGE_HERO",
                saved.getId(),
                "Uploaded new hero visual: " + result.getSecureUrl(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    // =========================================================================
    // 3. INGREDIENTS
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public List<IngredientDto> getAllIngredients() {
        return ingredientRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public IngredientDto getIngredient(String id) {
        Ingredient item = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));
        return cmsMapper.toDto(item);
    }

    @Override
    @Transactional
    public IngredientDto createIngredient(SaveIngredientRequest request, String adminEmail) {
        String id = request.getId() != null && !request.getId().isBlank()
                ? request.getId().trim()
                : "ing-" + UUID.randomUUID().toString().substring(0, 8);

        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) ingredientRepository.count() + 1;

        Ingredient item = Ingredient.builder()
                .id(id)
                .nameEn(request.getNameEn().trim())
                .nameKr(trimOrNull(request.getNameKr()))
                .nameVi(trimOrNull(request.getNameVi()))
                .nameJp(trimOrNull(request.getNameJp()))
                .subtitleEn(trimOrNull(request.getSubtitleEn()))
                .subtitleKr(trimOrNull(request.getSubtitleKr()))
                .subtitleVi(trimOrNull(request.getSubtitleVi()))
                .subtitleJp(trimOrNull(request.getSubtitleJp()))
                .descriptionEn(request.getDescriptionEn().trim())
                .descriptionKr(trimOrNull(request.getDescriptionKr()))
                .descriptionVi(trimOrNull(request.getDescriptionVi()))
                .descriptionJp(trimOrNull(request.getDescriptionJp()))
                .displayOrder(order)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Ingredient saved = ingredientRepository.save(item);

        auditLogService.record(
                adminEmail,
                null,
                "CREATE_INGREDIENT",
                "INGREDIENT",
                saved.getId(),
                "Created new ingredient: " + saved.getNameEn(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public IngredientDto updateIngredient(String id, SaveIngredientRequest request, String adminEmail) {
        Ingredient item = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        item.setNameEn(request.getNameEn().trim());
        item.setNameKr(trimOrNull(request.getNameKr()));
        item.setNameVi(trimOrNull(request.getNameVi()));
        item.setNameJp(trimOrNull(request.getNameJp()));

        item.setSubtitleEn(trimOrNull(request.getSubtitleEn()));
        item.setSubtitleKr(trimOrNull(request.getSubtitleKr()));
        item.setSubtitleVi(trimOrNull(request.getSubtitleVi()));
        item.setSubtitleJp(trimOrNull(request.getSubtitleJp()));

        item.setDescriptionEn(request.getDescriptionEn().trim());
        item.setDescriptionKr(trimOrNull(request.getDescriptionKr()));
        item.setDescriptionVi(trimOrNull(request.getDescriptionVi()));
        item.setDescriptionJp(trimOrNull(request.getDescriptionJp()));

        if (request.getDisplayOrder() != null) {
            item.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getIsActive() != null) {
            item.setIsActive(request.getIsActive());
        }

        item.setUpdatedAt(Instant.now());
        Ingredient saved = ingredientRepository.save(item);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_INGREDIENT",
                "INGREDIENT",
                saved.getId(),
                "Updated ingredient: " + saved.getNameEn(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public IngredientDto toggleIngredientStatus(String id, String adminEmail) {
        Ingredient item = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        boolean newStatus = !item.getIsActive();
        item.setIsActive(newStatus);
        item.setUpdatedAt(Instant.now());
        Ingredient saved = ingredientRepository.save(item);

        auditLogService.record(
                adminEmail,
                null,
                "TOGGLE_INGREDIENT_STATUS",
                "INGREDIENT",
                saved.getId(),
                "Toggled ingredient status to: " + (newStatus ? "ACTIVE" : "INACTIVE"),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void deleteIngredient(String id, String adminEmail) {
        Ingredient item = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        if (item.getImagePublicId() != null && !item.getImagePublicId().isBlank()) {
            cloudinaryService.deleteImage(item.getImagePublicId());
        }

        ingredientRepository.delete(item);

        auditLogService.record(
                adminEmail,
                null,
                "DELETE_INGREDIENT",
                "INGREDIENT",
                id,
                "Deleted ingredient: " + item.getNameEn(),
                null
        );
    }

    @Override
    @Transactional
    public IngredientDto uploadIngredientImage(String id, MultipartFile file, String adminEmail) {
        Ingredient item = ingredientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ingredient not found with id: " + id));

        if (item.getImagePublicId() != null && !item.getImagePublicId().isBlank()) {
            cloudinaryService.deleteImage(item.getImagePublicId());
        }

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file);
        item.setImageUrl(result.getSecureUrl());
        item.setImagePublicId(result.getPublicId());
        item.setUpdatedAt(Instant.now());

        Ingredient saved = ingredientRepository.save(item);

        auditLogService.record(
                adminEmail,
                null,
                "UPLOAD_INGREDIENT_IMAGE",
                "INGREDIENT",
                saved.getId(),
                "Uploaded ingredient image for " + saved.getNameEn() + ": " + result.getSecureUrl(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    // =========================================================================
    // 4. GOOGLE REVIEWS
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public List<GoogleReviewDto> getAllReviews() {
        return googleReviewRepository.findAllByOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public GoogleReviewDto getReview(String id) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        return cmsMapper.toDto(review);
    }

    @Override
    @Transactional
    public GoogleReviewDto createReview(SaveGoogleReviewRequest request, String adminEmail) {
        String id = request.getId() != null && !request.getId().isBlank()
                ? request.getId().trim()
                : "rev-" + UUID.randomUUID().toString().substring(0, 8);

        String initials = request.getReviewerInitials();
        if (initials == null || initials.isBlank()) {
            String[] parts = request.getReviewerName().trim().split("\\s+");
            if (parts.length >= 2) {
                initials = (parts[0].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
            } else {
                initials = request.getReviewerName().substring(0, Math.min(2, request.getReviewerName().length())).toUpperCase();
            }
        }

        int order = request.getDisplayOrder() != null ? request.getDisplayOrder() : (int) googleReviewRepository.count() + 1;

        GoogleReview review = GoogleReview.builder()
                .id(id)
                .reviewerName(request.getReviewerName().trim())
                .reviewerInitials(initials)
                .reviewerAvatarUrl(request.getReviewerAvatarUrl())
                .reviewerMetadata(request.getReviewerMetadata())
                .rating(request.getRating())
                .reviewLanguage(request.getReviewLanguage().trim())
                .reviewContent(request.getReviewContent().trim())
                .reviewDate(request.getReviewDate().trim())
                .ownerResponse(request.getOwnerResponse())
                .ownerResponseDate(request.getOwnerResponseDate())
                .reviewUrl(request.getReviewUrl())
                .isFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : true)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .displayOrder(order)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        GoogleReview saved = googleReviewRepository.save(review);

        auditLogService.record(
                adminEmail,
                null,
                "CREATE_GOOGLE_REVIEW",
                "GOOGLE_REVIEW",
                saved.getId(),
                "Curated Google review by " + saved.getReviewerName(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public GoogleReviewDto updateReview(String id, SaveGoogleReviewRequest request, String adminEmail) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        review.setReviewerName(request.getReviewerName().trim());

        if (request.getReviewerInitials() != null && !request.getReviewerInitials().isBlank()) {
            review.setReviewerInitials(request.getReviewerInitials().trim());
        }
        review.setReviewerAvatarUrl(request.getReviewerAvatarUrl());
        review.setReviewerMetadata(request.getReviewerMetadata());
        review.setRating(request.getRating());
        review.setReviewLanguage(request.getReviewLanguage().trim());
        review.setReviewContent(request.getReviewContent().trim());
        review.setReviewDate(request.getReviewDate().trim());

        review.setOwnerResponse(request.getOwnerResponse());
        review.setOwnerResponseDate(request.getOwnerResponseDate());
        review.setReviewUrl(request.getReviewUrl());

        if (request.getIsFeatured() != null) {
            review.setIsFeatured(request.getIsFeatured());
        }
        if (request.getIsActive() != null) {
            review.setIsActive(request.getIsActive());
        }
        if (request.getDisplayOrder() != null) {
            review.setDisplayOrder(request.getDisplayOrder());
        }

        review.setUpdatedAt(Instant.now());
        GoogleReview saved = googleReviewRepository.save(review);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_GOOGLE_REVIEW",
                "GOOGLE_REVIEW",
                saved.getId(),
                "Updated review by " + saved.getReviewerName(),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public GoogleReviewDto toggleReviewStatus(String id, String adminEmail) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        boolean newStatus = !review.getIsActive();
        review.setIsActive(newStatus);
        review.setUpdatedAt(Instant.now());
        GoogleReview saved = googleReviewRepository.save(review);

        auditLogService.record(
                adminEmail,
                null,
                "TOGGLE_GOOGLE_REVIEW_STATUS",
                "GOOGLE_REVIEW",
                saved.getId(),
                "Toggled review status to: " + (newStatus ? "ACTIVE" : "INACTIVE"),
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public GoogleReviewDto toggleReviewFeatured(String id, String adminEmail) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        boolean newFeatured = !review.getIsFeatured();
        review.setIsFeatured(newFeatured);
        review.setUpdatedAt(Instant.now());
        GoogleReview saved = googleReviewRepository.save(review);

        auditLogService.record(
                adminEmail,
                null,
                "TOGGLE_GOOGLE_REVIEW_FEATURED",
                "GOOGLE_REVIEW",
                saved.getId(),
                "Toggled review featured status to: " + newFeatured,
                null
        );

        return cmsMapper.toDto(saved);
    }

    @Override
    @Transactional
    public void deleteReview(String id, String adminEmail) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        googleReviewRepository.delete(review);

        auditLogService.record(
                adminEmail,
                null,
                "DELETE_GOOGLE_REVIEW",
                "GOOGLE_REVIEW",
                id,
                "Deleted review from " + review.getReviewerName(),
                null
        );
    }

    // =========================================================================
    // 5. HEADER & FOOTER SETTINGS
    // =========================================================================

    @Override
    @Transactional(readOnly = true)
    public HeaderFooterDto getHeaderFooter() {
        RestaurantSettings settings = settingsRepository.findDefault().orElse(null);
        return cmsMapper.toHeaderFooterDto(settings);
    }

    @Override
    @Transactional
    public HeaderFooterDto updateHeaderFooter(UpdateHeaderFooterRequest request, String adminEmail) {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant settings not found"));

        if (request.getPhoneNumber() != null) settings.setPhoneNumber(request.getPhoneNumber().trim());
        if (request.getHotlineVisible() != null) settings.setHotlineVisible(request.getHotlineVisible());
        if (request.getEmail() != null) settings.setEmail(request.getEmail().trim());

        settings.setNameEn(request.getBrandNameEn().trim());
        settings.setNameKr(request.getBrandNameKr().trim());
        settings.setNameVi(request.getBrandNameVi().trim());
        settings.setNameJp(request.getBrandNameJp().trim());

        if (request.getBrandSloganEn() != null) settings.setSloganEn(request.getBrandSloganEn());
        if (request.getBrandSloganKr() != null) settings.setSloganKr(request.getBrandSloganKr());
        if (request.getBrandSloganVi() != null) settings.setSloganVi(request.getBrandSloganVi());
        if (request.getBrandSloganJp() != null) settings.setSloganJp(request.getBrandSloganJp());

        if (request.getFooterAboutEn() != null) settings.setDescriptionEn(request.getFooterAboutEn());
        if (request.getFooterAboutKr() != null) settings.setDescriptionKr(request.getFooterAboutKr());
        if (request.getFooterAboutVi() != null) settings.setDescriptionVi(request.getFooterAboutVi());
        if (request.getFooterAboutJp() != null) settings.setDescriptionJp(request.getFooterAboutJp());

        if (request.getAddressEn() != null) settings.setAddressEn(request.getAddressEn().trim());
        if (request.getAddressKr() != null) settings.setAddressKr(request.getAddressKr().trim());
        if (request.getAddressVi() != null) settings.setAddressVi(request.getAddressVi().trim());
        if (request.getAddressJp() != null) settings.setAddressJp(request.getAddressJp().trim());

        if (request.getClosedDaysEn() != null) settings.setClosedDaysEn(request.getClosedDaysEn());
        if (request.getClosedDaysKr() != null) settings.setClosedDaysKr(request.getClosedDaysKr());
        if (request.getClosedDaysVi() != null) settings.setClosedDaysVi(request.getClosedDaysVi());
        if (request.getClosedDaysJp() != null) settings.setClosedDaysJp(request.getClosedDaysJp());

        if (request.getPolicyOneDishEn() != null) settings.setPolicyOneDishEn(request.getPolicyOneDishEn());
        if (request.getPolicyOneDishKr() != null) settings.setPolicyOneDishKr(request.getPolicyOneDishKr());
        if (request.getPolicyOneDishVi() != null) settings.setPolicyOneDishVi(request.getPolicyOneDishVi());
        if (request.getPolicyOneDishJp() != null) settings.setPolicyOneDishJp(request.getPolicyOneDishJp());

        if (request.getPolicyVatEn() != null) settings.setPolicyVatEn(request.getPolicyVatEn());
        if (request.getPolicyVatKr() != null) settings.setPolicyVatKr(request.getPolicyVatKr());
        if (request.getPolicyVatVi() != null) settings.setPolicyVatVi(request.getPolicyVatVi());
        if (request.getPolicyVatJp() != null) settings.setPolicyVatJp(request.getPolicyVatJp());

        if (request.getPolicyTakeoutEn() != null) settings.setPolicyTakeoutEn(request.getPolicyTakeoutEn());
        if (request.getPolicyTakeoutKr() != null) settings.setPolicyTakeoutKr(request.getPolicyTakeoutKr());
        if (request.getPolicyTakeoutVi() != null) settings.setPolicyTakeoutVi(request.getPolicyTakeoutVi());
        if (request.getPolicyTakeoutJp() != null) settings.setPolicyTakeoutJp(request.getPolicyTakeoutJp());

        if (request.getEstablishedYear() != null) settings.setEstablishedYear(request.getEstablishedYear().trim());
        if (request.getCopyrightTextEn() != null) settings.setCopyrightTextEn(request.getCopyrightTextEn());
        if (request.getCopyrightTextKr() != null) settings.setCopyrightTextKr(request.getCopyrightTextKr());
        if (request.getCopyrightTextVi() != null) settings.setCopyrightTextVi(request.getCopyrightTextVi());
        if (request.getCopyrightTextJp() != null) settings.setCopyrightTextJp(request.getCopyrightTextJp());

        settings.setUpdatedAt(Instant.now());
        settings.setUpdatedBy(adminEmail);
        RestaurantSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                adminEmail,
                null,
                "UPDATE_HEADER_FOOTER",
                "HEADER_FOOTER",
                "default",
                "Updated Header & Footer branding, notice policies, and copyright text",
                null
        );

        return cmsMapper.toHeaderFooterDto(saved);
    }

    @Override
    @Transactional
    public HeaderFooterDto uploadLogo(MultipartFile file, String adminEmail) {
        RestaurantSettings settings = settingsRepository.findDefault()
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant settings not found"));

        if (settings.getLogoPublicId() != null && !settings.getLogoPublicId().isBlank()) {
            cloudinaryService.deleteImage(settings.getLogoPublicId());
        }

        CloudinaryUploadResult result = cloudinaryService.uploadImage(file);
        settings.setLogoUrl(result.getSecureUrl());
        settings.setLogoPublicId(result.getPublicId());
        settings.setUpdatedAt(Instant.now());
        settings.setUpdatedBy(adminEmail);

        RestaurantSettings saved = settingsRepository.save(settings);

        auditLogService.record(
                adminEmail,
                null,
                "UPLOAD_LOGO",
                "HEADER_FOOTER",
                "default",
                "Uploaded brand logo: " + result.getSecureUrl(),
                null
        );

        return cmsMapper.toHeaderFooterDto(saved);
    }

    private String trimOrNull(String str) {
        if (str == null) return null;
        String trimmed = str.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

