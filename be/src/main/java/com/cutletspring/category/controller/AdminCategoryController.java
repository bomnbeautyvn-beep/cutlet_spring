package com.cutletspring.category.controller;

import com.cutletspring.category.dto.CategoryRequest;
import com.cutletspring.category.dto.CategoryResponse;
import com.cutletspring.category.service.MenuCategoryService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@Tag(name = "Admin Categories", description = "Administrative management for menu categories")
public class AdminCategoryController {

    private final MenuCategoryService categoryService;

    @Operation(summary = "List All Categories", description = "Retrieves all categories including inactive ones for administration")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @Operation(summary = "Get Category by ID", description = "Retrieves category metadata by its unique identifier")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable String id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }

    @Operation(summary = "Create Category", description = "Creates a new menu category")
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse created = categoryService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", created));
    }

    @Operation(summary = "Update Category", description = "Updates an existing menu category")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable String id,
            @Valid @RequestBody CategoryRequest request) {
        CategoryResponse updated = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @Operation(summary = "Toggle Category Status", description = "Activates or deactivates a menu category")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CategoryResponse>> setCategoryStatus(
            @PathVariable String id,
            @RequestBody java.util.Map<String, Boolean> payload) {
        boolean active = payload != null && Boolean.TRUE.equals(payload.get("active"));
        CategoryResponse updated = categoryService.setCategoryStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Category status updated successfully", updated));
    }

    @Operation(summary = "Delete Category", description = "Safely deletes an unreferenced menu category")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
