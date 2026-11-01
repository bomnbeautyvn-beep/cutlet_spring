package com.cutletspring.menu;

import com.cutletspring.menu.controller.MenuController;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.service.MenuItemService;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
class MenuControllerTests {

    @Autowired
    private MenuController menuController;

    @Autowired
    private MenuItemService menuItemService;

    @Test
    @DisplayName("GET /api/menu - Successfully retrieves all active menu items")
    void testGetPublicMenu() {
        ResponseEntity<ApiResponse<List<MenuItemResponse>>> response = menuController.getMenuItems(null);
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        List<MenuItemResponse> items = response.getBody().getData();
        assertNotNull(items);
        assertTrue(items.size() >= 38);
        assertNotNull(items.get(0).getId());
        assertNotNull(items.get(0).getNameEn());
        assertTrue(items.get(0).getPrice() > 0);
    }

    @Test
    @DisplayName("GET /api/menu?category=japanese - Filters items by category")
    void testGetMenuByCategory() {
        ResponseEntity<ApiResponse<List<MenuItemResponse>>> response = menuController.getMenuItems("japanese");
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        List<MenuItemResponse> items = response.getBody().getData();
        assertNotNull(items);
        assertTrue(items.size() >= 5);
        for (MenuItemResponse item : items) {
            assertEquals("japanese", item.getCategory());
        }
    }

    @Test
    @DisplayName("GET /api/menu/featured - Retrieves chef signature and best seller items")
    void testGetFeaturedItems() {
        ResponseEntity<ApiResponse<List<MenuItemResponse>>> response = menuController.getFeaturedItems();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        List<MenuItemResponse> items = response.getBody().getData();
        assertNotNull(items);
        assertFalse(items.isEmpty());
        assertNotNull(items.get(0).getNameEn());
    }

    @Test
    @DisplayName("GET /api/menu/{id} - Successfully retrieves dish by ID")
    void testGetMenuItemById() {
        ResponseEntity<ApiResponse<MenuItemResponse>> response = menuController.getMenuItemById("half-and-half-pork-cutlet");
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        MenuItemResponse item = response.getBody().getData();
        assertNotNull(item);
        assertEquals("half-and-half-pork-cutlet", item.getId());
        assertEquals("Half & Half Pork Cutlet", item.getNameEn());
        assertEquals(180, item.getPrice());
        assertTrue(item.isBestSeller());
    }

    @Test
    @DisplayName("GET /api/menu/{id} - Throws ResourceNotFoundException when item does not exist")
    void testGetMenuItemNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> menuController.getMenuItemById("unknown-dish-id-xyz"));
    }
}
