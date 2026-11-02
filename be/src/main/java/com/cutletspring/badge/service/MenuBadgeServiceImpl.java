package com.cutletspring.badge.service;

import com.cutletspring.badge.dto.BadgeRequest;
import com.cutletspring.badge.dto.BadgeResponse;
import com.cutletspring.badge.entity.MenuBadge;
import com.cutletspring.badge.repository.MenuBadgeRepository;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuBadgeServiceImpl implements MenuBadgeService {

    private final MenuBadgeRepository badgeRepository;

    @Override
    @Transactional(readOnly = true)
    public List<BadgeResponse> getActiveBadges() {
        return badgeRepository.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BadgeResponse> getAllBadges() {
        return badgeRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public BadgeResponse getBadgeById(String id) {
        MenuBadge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu badge not found with identifier: " + id));
        return mapToResponse(badge);
    }

    @Override
    @Transactional
    public BadgeResponse createBadge(BadgeRequest request) {
        String code = request.getCode().toLowerCase().trim();
        if (badgeRepository.existsByCodeIgnoreCase(code)) {
            throw new ConflictException("Menu badge with code '" + code + "' already exists");
        }

        String id = code.replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");

        MenuBadge badge = MenuBadge.builder()
                .id(id)
                .code(code)
                .name(request.getName().trim())
                .nameVi(request.getNameVi() != null ? request.getNameVi().trim() : null)
                .nameKr(request.getNameKr() != null ? request.getNameKr().trim() : null)
                .nameJp(request.getNameJp() != null ? request.getNameJp().trim() : null)
                .description(request.getDescription())
                .badgeColor(request.getBadgeColor() != null ? request.getBadgeColor() : "#af101a")
                .icon(request.getIcon() != null ? request.getIcon() : "star")
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        MenuBadge saved = badgeRepository.save(badge);
        log.info("Created new menu badge: {} (id: {})", saved.getName(), saved.getId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BadgeResponse updateBadge(String id, BadgeRequest request) {
        MenuBadge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu badge not found with identifier: " + id));

        String newCode = request.getCode().toLowerCase().trim();
        if (!badge.getCode().equalsIgnoreCase(newCode) && badgeRepository.existsByCodeIgnoreCase(newCode)) {
            throw new ConflictException("Menu badge with code '" + newCode + "' already exists");
        }

        badge.setCode(newCode);
        badge.setName(request.getName().trim());
        badge.setNameVi(request.getNameVi() != null ? request.getNameVi().trim() : null);
        badge.setNameKr(request.getNameKr() != null ? request.getNameKr().trim() : null);
        badge.setNameJp(request.getNameJp() != null ? request.getNameJp().trim() : null);
        badge.setDescription(request.getDescription());
        if (request.getBadgeColor() != null) badge.setBadgeColor(request.getBadgeColor());
        if (request.getIcon() != null) badge.setIcon(request.getIcon());
        if (request.getDisplayOrder() != null) badge.setDisplayOrder(request.getDisplayOrder());
        if (request.getActive() != null) badge.setActive(request.getActive());

        MenuBadge updated = badgeRepository.save(badge);
        log.info("Updated menu badge: {} (id: {})", updated.getName(), updated.getId());
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public BadgeResponse setBadgeStatus(String id, boolean active) {
        MenuBadge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu badge not found with identifier: " + id));
        badge.setActive(active);
        MenuBadge updated = badgeRepository.save(badge);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteBadge(String id) {
        MenuBadge badge = badgeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu badge not found with identifier: " + id));

        long assignedCount = badgeRepository.countAssignedMenuItems(id);
        if (assignedCount > 0) {
            throw new ConflictException("Cannot delete badge '" + badge.getName() + "' because it is currently assigned to "
                    + assignedCount + " menu item(s). Please unassign the badge or deactivate it instead.");
        }

        badgeRepository.delete(badge);
        log.info("Deleted menu badge: {} (id: {})", badge.getName(), id);
    }

    private BadgeResponse mapToResponse(MenuBadge entity) {
        long count = badgeRepository.countAssignedMenuItems(entity.getId());
        return BadgeResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .nameVi(entity.getNameVi())
                .nameKr(entity.getNameKr())
                .nameJp(entity.getNameJp())
                .description(entity.getDescription())
                .badgeColor(entity.getBadgeColor())
                .icon(entity.getIcon())
                .displayOrder(entity.getDisplayOrder())
                .active(entity.isActive())
                .assignedCount(count)
                .build();
    }
}

