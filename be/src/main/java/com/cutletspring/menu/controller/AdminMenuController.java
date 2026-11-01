package com.cutletspring.menu.controller;

import com.cutletspring.menu.dto.MenuItemRequest;
import com.cutletspring.menu.dto.MenuItemResponse;
import com.cutletspring.menu.dto.MenuStatusUpdateRequest;
import com.cutletspring.menu.service.MenuItemService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/menu")
@RequiredArgsConstructor
@Tag(name = "Admin Menu Management", description = "Administrative endpoints for dish catalog, options, pricing, and Cloudinary image asset synchronization")
public class AdminMenuController {

    private final MenuItemService menuItemService;

    @Operation(summary = "List Menu Items (Paginated)", description = "Retrieves paginated menu items with category and active filters for administration")
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MenuItemResponse>>> getAdminMenuItems(
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("displayOrder").ascending());
        Page<MenuItemResponse> result = menuItemService.getAdminMenuItems(categoryId, active, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @Operation(summary = "Get Menu Item Details", description = "Retrieves full entity details for a menu item")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> getAdminMenuItemById(@PathVariable String id) {
        MenuItemResponse item = menuItemService.getAdminMenuItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item));
    }

    @Operation(summary = "Create Menu Item", description = "Creates a new dish entry in the restaurant catalog")
    @PostMapping
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        MenuItemResponse created = menuItemService.createMenuItem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item created successfully", created));
    }

    @Operation(summary = "Update Menu Item", description = "Updates an existing dish entry, multilingual metadata, and options")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable String id,
            @Valid @RequestBody MenuItemRequest request
    ) {
        MenuItemResponse updated = menuItemService.updateMenuItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated successfully", updated));
    }

    @Operation(summary = "Update Active Status Explicitly", description = "Sets visibility status of the dish on the public dining menu")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody MenuStatusUpdateRequest request
    ) {
        MenuItemResponse updated = menuItemService.updateStatus(id, request.getActive());
        return ResponseEntity.ok(ApiResponse.success("Menu item active status updated successfully", updated));
    }

    @Operation(summary = "Toggle Active Status", description = "Toggles visibility of the dish on the public dining menu")
    @PatchMapping("/{id}/active")
    public ResponseEntity<ApiResponse<MenuItemResponse>> toggleActive(@PathVariable String id) {
        MenuItemResponse updated = menuItemService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item active status toggled", updated));
    }

    @Operation(summary = "Delete Menu Item", description = "Soft-deletes a menu item to preserve order ticket snapshots")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable String id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deactivated successfully", null));
    }

    @Operation(summary = "Upload Dish Image to Cloudinary", description = "Uploads a photo to Cloudinary, deletes previous photo, and updates dish image URL")
    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MenuItemResponse>> uploadImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file
    ) {
        MenuItemResponse updated = menuItemService.uploadMenuItemImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded to Cloudinary successfully", updated));
    }

    @Operation(summary = "Remove Dish Image", description = "Deletes photo from Cloudinary and clears dish image URL")
    @DeleteMapping("/{id}/image")
    public ResponseEntity<ApiResponse<MenuItemResponse>> deleteImage(@PathVariable String id) {
        MenuItemResponse updated = menuItemService.deleteMenuItemImage(id);
        return ResponseEntity.ok(ApiResponse.success("Image removed from Cloudinary successfully", updated));
    }
}
