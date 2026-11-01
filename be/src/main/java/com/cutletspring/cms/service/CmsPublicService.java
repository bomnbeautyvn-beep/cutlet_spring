package com.cutletspring.cms.service;

import com.cutletspring.cms.dto.*;
import com.cutletspring.cms.entity.HomepageHeroContent;
import com.cutletspring.cms.mapper.CmsMapper;
import com.cutletspring.cms.repository.GoogleReviewRepository;
import com.cutletspring.cms.repository.HomepageHeroContentRepository;
import com.cutletspring.cms.repository.HomepageSectionRepository;
import com.cutletspring.cms.repository.IngredientRepository;
import com.cutletspring.restaurant.dto.RestaurantSettingsDto;
import com.cutletspring.restaurant.entity.RestaurantSettings;
import com.cutletspring.restaurant.mapper.RestaurantSettingsMapper;
import com.cutletspring.restaurant.repository.RestaurantSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CmsPublicService {

    private final HomepageSectionRepository sectionRepository;
    private final HomepageHeroContentRepository heroContentRepository;
    private final IngredientRepository ingredientRepository;
    private final GoogleReviewRepository googleReviewRepository;
    private final RestaurantSettingsRepository settingsRepository;
    private final CmsMapper cmsMapper;
    private final RestaurantSettingsMapper settingsMapper;

    @Transactional(readOnly = true)
    public HomepagePublicResponse getHomepageData() {
        List<HomepageSectionDto> sections = sectionRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();

        HomepageHeroContent heroEntity = heroContentRepository.findAllActive().stream()
                .findFirst()
                .orElseGet(() -> heroContentRepository.findDefaultHero().orElse(null));
        HomepageHeroDto hero = cmsMapper.toDto(heroEntity);

        List<IngredientDto> ingredients = ingredientRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();

        GoogleReviewsSummaryDto reviewsSummary = getReviewsSummary();

        List<GoogleReviewDto> reviews = googleReviewRepository.findAllByIsActiveTrueAndIsFeaturedTrueOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();

        RestaurantSettings settings = settingsRepository.findDefault().orElse(null);
        RestaurantSettingsDto restaurantDto = settingsMapper.toDto(settings);
        HeaderFooterDto headerFooterDto = cmsMapper.toHeaderFooterDto(settings);

        return HomepagePublicResponse.builder()
                .sections(sections)
                .hero(hero)
                .ingredients(ingredients)
                .reviewsSummary(reviewsSummary)
                .reviews(reviews)
                .restaurant(restaurantDto)
                .headerFooter(headerFooterDto)
                .build();
    }

    @Transactional(readOnly = true)
    public List<IngredientDto> getActiveIngredients() {
        return ingredientRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GoogleReviewDto> getActiveReviews() {
        return googleReviewRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(cmsMapper::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public GoogleReviewsSummaryDto getReviewsSummary() {
        RestaurantSettings settings = settingsRepository.findDefault().orElse(null);

        BigDecimal rating = settings != null && settings.getGoogleRating() != null
                ? settings.getGoogleRating()
                : BigDecimal.valueOf(4.8);

        Integer reviewCount = settings != null && settings.getGoogleReviewCount() != null
                ? settings.getGoogleReviewCount()
                : 562;

        String mapsUrl = settings != null && settings.getGoogleMapsUrl() != null
                ? settings.getGoogleMapsUrl()
                : "https://www.google.com/maps";

        String embedUrl = settings != null && settings.getGoogleMapsEmbedUrl() != null
                ? settings.getGoogleMapsEmbedUrl()
                : "";

        return GoogleReviewsSummaryDto.builder()
                .averageRating(rating)
                .totalReviewsCount(reviewCount)
                .googleMapsUrl(mapsUrl)
                .googleMapsEmbedUrl(embedUrl)
                .build();
    }

    @Transactional(readOnly = true)
    public HeaderFooterDto getHeaderFooter() {
        RestaurantSettings settings = settingsRepository.findDefault().orElse(null);
        return cmsMapper.toHeaderFooterDto(settings);
    }
}

