package com.cutletspring.category.controller;

import com.cutletspring.category.dto.CategoryResponse;
import com.cutletspring.category.service.MenuCategoryService;
import com.cutletspring.shared.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Menu Categories", description = "Public endpoints for menu categories")
public class CategoryController {

    private final MenuCategoryService categoryService;

    @Operation(summary = "Get Active Categories", description = "Retrieves all currently active menu categories ordered by display order")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        List<CategoryResponse> categories = categoryService.getActiveCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @Operation(summary = "Get Category by ID", description = "Retrieves category metadata by its unique identifier")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable String id) {
        CategoryResponse category = categoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success(category));
    }
}

