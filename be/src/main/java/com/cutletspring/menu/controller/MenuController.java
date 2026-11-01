package com.cutletspring.menu.controller;

import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.service.MenuItemService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/menu", "/menu"})
@RequiredArgsConstructor
@Tag(name = "Public Menu", description = "Endpoints for viewing Cutlet Spring tonkatsu catalog, categories, and featured dishes")
public class MenuController {

    private final MenuItemService menuItemService;

    @Operation(summary = "Get Public Menu", description = "Returns active menu dishes, optionally filtered by category (e.g. japanese, korean, curry)")
    @GetMapping
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenuItems(
            @RequestParam(required = false) String category
    ) {
        List<MenuItemResponse> items = menuItemService.getPublicMenuItems(category);
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @Operation(summary = "Get Featured Items", description = "Returns Chef Signature and Best Seller dishes")
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getFeaturedItems() {
        List<MenuItemResponse> featured = menuItemService.getFeaturedItems();
        return ResponseEntity.ok(ApiResponse.success(featured));
    }

    @Operation(summary = "Get Menu Item by ID", description = "Returns complete dish specifications, portions, sizes, sauces, and add-on options")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getMenuItemById(@PathVariable String id) {
        MenuItemResponse item = menuItemService.getPublicMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }
}

