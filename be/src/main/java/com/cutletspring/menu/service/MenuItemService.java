package com.cutletspring.menu.service;

import com.cutletspring.menu.dto.MenuItemRequest;
import com.cutletspring.menu.dto.MenuItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MenuItemService {

    List<MenuItemResponse> getPublicMenuItems(String categoryCode);

    MenuItemResponse getPublicMenuItemById(String id);

    List<MenuItemResponse> getFeaturedItems();

    Page<MenuItemResponse> getAdminMenuItems(String categoryId, Boolean active, Pageable pageable);

    MenuItemResponse getAdminMenuItemById(String id);

    MenuItemResponse createMenuItem(MenuItemRequest request);

    MenuItemResponse updateMenuItem(String id, MenuItemRequest request);

    MenuItemResponse toggleActive(String id);

    MenuItemResponse updateStatus(String id, boolean active);

    void deleteMenuItem(String id);

    MenuItemResponse uploadMenuItemImage(String id, MultipartFile file);

    MenuItemResponse deleteMenuItemImage(String id);
}
