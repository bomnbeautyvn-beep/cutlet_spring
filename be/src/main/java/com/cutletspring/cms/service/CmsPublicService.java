package com.cutletspring.cms.service;

import com.cutletspring.cms.dto.*;

import java.util.List;

public interface CmsPublicService {

    HomepagePublicResponse getHomepageData();

    List<IngredientDto> getActiveIngredients();

    List<GoogleReviewDto> getActiveReviews();

    GoogleReviewsSummaryDto getReviewsSummary();

    HeaderFooterDto getHeaderFooter();
}
