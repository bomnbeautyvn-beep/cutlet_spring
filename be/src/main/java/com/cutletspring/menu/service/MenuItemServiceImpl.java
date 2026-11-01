package com.cutletspring.menu.service;

import com.cutletspring.category.entity.MenuCategory;
import com.cutletspring.category.repository.MenuCategoryRepository;
import com.cutletspring.cloudinary.dto.CloudinaryUploadResult;
import com.cutletspring.cloudinary.service.CloudinaryService;
import com.cutletspring.menu.dto.MenuItemAddonDto;
import com.cutletspring.menu.dto.MenuItemRequest;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.dto.MenuItemSizeOptionDto;
import com.cutletspring.menu.entity.MenuItem;
import com.cutletspring.menu.entity.MenuItemAddon;
import com.cutletspring.menu.entity.MenuItemSauceOption;
import com.cutletspring.menu.entity.MenuItemSizeOption;
import com.cutletspring.menu.mapper.MenuItemMapper;
import com.cutletspring.menu.repository.MenuItemRepository;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class MenuItemServiceImpl implements MenuItemService {

    private final MenuItemRepository menuItemRepository;
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemMapper menuItemMapper;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getPublicMenuItems(String categoryCode) {
        List<MenuItem> items;
        if (categoryCode != null && !categoryCode.isBlank() && !"all".equalsIgnoreCase(categoryCode)) {
            items = menuItemRepository.findAllByCategoryIdAndActiveTrueOrderByDisplayOrderAsc(categoryCode.toLowerCase());
        } else {
            items = menuItemRepository.findAllByActiveTrueOrderByDisplayOrderAsc();
        }
        return items.stream().map(menuItemMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getPublicMenuItemById(String id) {
        MenuItem item = menuItemRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemResponse> getFeaturedItems() {
        return menuItemRepository.findFeaturedItems().stream()
                .map(menuItemMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MenuItemResponse> getAdminMenuItems(String categoryId, Boolean active, Pageable pageable) {
        return menuItemRepository.findAdminMenuItems(categoryId, active, pageable)
                .map(menuItemMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getAdminMenuItemById(String id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return menuItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        String itemId = request.getId();
        if (itemId == null || itemId.isBlank()) {
            itemId = request.getNameEn().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        }

        if (menuItemRepository.existsById(itemId)) {
            throw new ConflictException("Menu item with identifier '" + itemId + "' already exists");
        }

        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem item = MenuItem.builder()
                .id(itemId)
                .category(category)
                .nameEn(request.getNameEn().trim())
                .nameKr(request.getNameKr().trim())
                .nameKrSubtitle(request.getNameKrSubtitle())
                .nameJp(request.getNameJp())
                .nameVi(request.getNameVi())
                .descriptionEn(request.getDescriptionEn().trim())
                .descriptionKr(request.getDescriptionKr().trim())
                .descriptionVi(request.getDescriptionVi())
                .descriptionJp(request.getDescriptionJp())
                .portionEn(request.getPortionEn())
                .portionVi(request.getPortionVi())
                .portionKr(request.getPortionKr())
                .portionJp(request.getPortionJp())
                .basePrice(request.getBasePrice())
                .prepTimeMinutes(request.getPrepTimeMinutes() != null && request.getPrepTimeMinutes() > 0 ? request.getPrepTimeMinutes() : 15)
                .imageUrl(request.getImageUrl())
                .imagePublicId(request.getImagePublicId())
                .altText(request.getAltText())
                .isBestSeller(Boolean.TRUE.equals(request.getIsBestSeller()))
                .isChefSignature(Boolean.TRUE.equals(request.getIsChefSignature()))
                .isLimited(Boolean.TRUE.equals(request.getIsLimited()))
                .isSpicy(Boolean.TRUE.equals(request.getIsSpicy()))
                .spiceLevel(request.getSpiceLevel() != null ? request.getSpiceLevel() : 0)
                .spiceNote(request.getSpiceNote())
                .dishTypes(request.getDishTypes() != null ? new HashSet<>(request.getDishTypes()) : new HashSet<>())
                .tags(request.getTags() != null ? new HashSet<>(request.getTags()) : new HashSet<>())
                .features(request.getFeatures() != null ? new HashSet<>(request.getFeatures()) : new HashSet<>())
                .active(request.getActive() != null ? request.getActive() : true)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .sizes(new ArrayList<>())
                .sauceOptions(new ArrayList<>())
                .addons(new ArrayList<>())
                .build();

        // Attach sizes
        if (request.getSizes() != null) {
            int sOrder = 1;
            for (MenuItemSizeOptionDto s : request.getSizes()) {
                item.getSizes().add(MenuItemSizeOption.builder()
                        .menuItem(item)
                        .label(s.getLabel())
                        .price(s.getPrice())
                        .displayOrder(s.getDisplayOrder() > 0 ? s.getDisplayOrder() : sOrder++)
                        .build());
            }
        }

        // Attach sauces
        if (request.getSauceOptions() != null) {
            int sauceOrder = 1;
            for (String sauceName : request.getSauceOptions()) {
                item.getSauceOptions().add(MenuItemSauceOption.builder()
                        .menuItem(item)
                        .name(sauceName)
                        .price(0)
                        .displayOrder(sauceOrder++)
                        .build());
            }
        }

        // Attach addons
        if (request.getAddons() != null) {
            int aOrder = 1;
            for (MenuItemAddonDto a : request.getAddons()) {
                item.getAddons().add(MenuItemAddon.builder()
                        .menuItem(item)
                        .name(a.getName())
                        .price(a.getPrice())
                        .displayOrder(a.getDisplayOrder() > 0 ? a.getDisplayOrder() : aOrder++)
                        .build());
            }
        }

        MenuItem saved = menuItemRepository.save(item);
        return menuItemMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(String id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        item.setCategory(category);
        item.setNameEn(request.getNameEn().trim());
        item.setNameKr(request.getNameKr().trim());
        item.setNameKrSubtitle(request.getNameKrSubtitle());
        item.setNameJp(request.getNameJp());
        item.setNameVi(request.getNameVi());
        item.setDescriptionEn(request.getDescriptionEn().trim());
        item.setDescriptionKr(request.getDescriptionKr().trim());
        item.setDescriptionVi(request.getDescriptionVi());
        item.setDescriptionJp(request.getDescriptionJp());
        item.setPortionEn(request.getPortionEn());
        item.setPortionVi(request.getPortionVi());
        item.setPortionKr(request.getPortionKr());
        item.setPortionJp(request.getPortionJp());
        item.setBasePrice(request.getBasePrice());
        item.setPrepTimeMinutes(request.getPrepTimeMinutes() != null && request.getPrepTimeMinutes() > 0 ? request.getPrepTimeMinutes() : 15);
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        if (request.getImagePublicId() != null) item.setImagePublicId(request.getImagePublicId());
        item.setAltText(request.getAltText());
        item.setBestSeller(Boolean.TRUE.equals(request.getIsBestSeller()));
        item.setChefSignature(Boolean.TRUE.equals(request.getIsChefSignature()));
        item.setLimited(Boolean.TRUE.equals(request.getIsLimited()));
        item.setSpicy(Boolean.TRUE.equals(request.getIsSpicy()));
        item.setSpiceLevel(request.getSpiceLevel() != null ? request.getSpiceLevel() : 0);
        item.setSpiceNote(request.getSpiceNote());

        if (request.getDishTypes() != null) item.setDishTypes(new HashSet<>(request.getDishTypes()));
        if (request.getTags() != null) item.setTags(new HashSet<>(request.getTags()));
        if (request.getFeatures() != null) item.setFeatures(new HashSet<>(request.getFeatures()));
        if (request.getActive() != null) item.setActive(request.getActive());
        if (request.getDisplayOrder() != null) item.setDisplayOrder(request.getDisplayOrder());

        // Update sizes
        if (request.getSizes() != null) {
            item.getSizes().clear();
            int sOrder = 1;
            for (MenuItemSizeOptionDto s : request.getSizes()) {
                item.getSizes().add(MenuItemSizeOption.builder()
                        .menuItem(item)
                        .label(s.getLabel())
                        .price(s.getPrice())
                        .displayOrder(s.getDisplayOrder() > 0 ? s.getDisplayOrder() : sOrder++)
                        .build());
            }
        }

        // Update sauces
        if (request.getSauceOptions() != null) {
            item.getSauceOptions().clear();
            int sauceOrder = 1;
            for (String sauceName : request.getSauceOptions()) {
                item.getSauceOptions().add(MenuItemSauceOption.builder()
                        .menuItem(item)
                        .name(sauceName)
                        .price(0)
                        .displayOrder(sauceOrder++)
                        .build());
            }
        }

        // Update addons
        if (request.getAddons() != null) {
            item.getAddons().clear();
            int aOrder = 1;
            for (MenuItemAddonDto a : request.getAddons()) {
                item.getAddons().add(MenuItemAddon.builder()
                        .menuItem(item)
                        .name(a.getName())
                        .price(a.getPrice())
                        .displayOrder(a.getDisplayOrder() > 0 ? a.getDisplayOrder() : aOrder++)
                        .build());
            }
        }

        MenuItem updated = menuItemRepository.save(item);
        return menuItemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public MenuItemResponse toggleActive(String id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setActive(!item.isActive());
        MenuItem updated = menuItemRepository.save(item);
        return menuItemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public MenuItemResponse updateStatus(String id, boolean active) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setActive(active);
        MenuItem updated = menuItemRepository.save(item);
        return menuItemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteMenuItem(String id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setActive(false);
        menuItemRepository.save(item);
    }

    @Override
    @Transactional
    public MenuItemResponse uploadMenuItemImage(String id, MultipartFile file) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        CloudinaryUploadResult uploadResult = cloudinaryService.replaceImage(item.getImagePublicId(), file);
        item.setImageUrl(uploadResult.getSecureUrl());
        item.setImagePublicId(uploadResult.getPublicId());

        MenuItem updated = menuItemRepository.save(item);
        log.info("Successfully updated image for menu item {}: {}", id, uploadResult.getSecureUrl());
        return menuItemMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public MenuItemResponse deleteMenuItemImage(String id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (item.getImagePublicId() != null) {
            cloudinaryService.deleteImage(item.getImagePublicId());
            item.setImagePublicId(null);
            item.setImageUrl("");
            MenuItem updated = menuItemRepository.save(item);
            return menuItemMapper.toResponse(updated);
        }

        return menuItemMapper.toResponse(item);
    }
}

