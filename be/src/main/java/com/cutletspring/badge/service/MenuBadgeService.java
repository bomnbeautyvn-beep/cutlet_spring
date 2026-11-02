package com.cutletspring.badge.service;

import com.cutletspring.badge.dto.BadgeRequest;
import com.cutletspring.badge.dto.BadgeResponse;

import java.util.List;

public interface MenuBadgeService {

    List<BadgeResponse> getActiveBadges();

    List<BadgeResponse> getAllBadges();

    BadgeResponse getBadgeById(String id);

    BadgeResponse createBadge(BadgeRequest request);

    BadgeResponse updateBadge(String id, BadgeRequest request);

    BadgeResponse setBadgeStatus(String id, boolean active);

    void deleteBadge(String id);
}

