package com.cutletspring.category;

import com.cutletspring.category.controller.AdminCategoryController;
import com.cutletspring.category.controller.CategoryController;
import com.cutletspring.category.dto.CategoryRequest;
import com.cutletspring.category.dto.CategoryResponse;
import com.cutletspring.category.service.MenuCategoryService;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.response.ApiResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CategoryControllerTests {

    @Autowired
    private CategoryController categoryController;

    @Autowired
    private AdminCategoryController adminCategoryController;

    @Autowired
    private MenuCategoryService categoryService;

    @Test
    @DisplayName("GET /api/categories - Retrieves active categories in display order")
    void testGetCategories() {
        ResponseEntity<ApiResponse<List<CategoryResponse>>> response = categoryController.getCategories();
        assertNotNull(response);
        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isSuccess());
        List<CategoryResponse> categories = response.getBody().getData();
        assertNotNull(categories);
        assertEquals(7, categories.size());
        assertEquals("japanese", categories.get(0).getCode());
        assertEquals("korean", categories.get(1).getCode());
        assertEquals("curry", categories.get(2).getCode());
        assertEquals("noodles", categories.get(3).getCode());
    }

    @Test
    @DisplayName("CategoryService retrieves category by ID")
    void testGetCategoryById() {
        CategoryResponse category = categoryService.getCategoryById("japanese");
        assertNotNull(category);
        assertEquals("japanese", category.getCode());
        assertEquals("Japanese Tonkatsu", category.getName());
    }

    @Test
    @DisplayName("Admin Category CRUD and safe deletion check")
    void testAdminCategoryCrudAndSafeDeletion() {
        // 1. Create a unique new category
        CategoryRequest req = CategoryRequest.builder()
                .code("appetizers")
                .name("Artisanal Appetizers")
                .description("Handmade starters and side tastings")
                .displayOrder(8)
                .active(true)
                .build();

        ResponseEntity<ApiResponse<CategoryResponse>> createdResp = adminCategoryController.createCategory(req);
        assertEquals(201, createdResp.getStatusCode().value());
        CategoryResponse created = createdResp.getBody().getData();
        assertEquals("appetizers", created.getCode());

        // 2. Prevent duplicate code
        assertThrows(ConflictException.class, () -> adminCategoryController.createCategory(req));

        // 3. Admin Get By ID
        ResponseEntity<ApiResponse<CategoryResponse>> getResp = adminCategoryController.getCategoryById("appetizers");
        assertEquals(200, getResp.getStatusCode().value());
        assertEquals("Artisanal Appetizers", getResp.getBody().getData().getName());

        // 4. Update
        CategoryRequest updateReq = CategoryRequest.builder()
                .code("appetizers")
                .name("Seasonal Appetizers")
                .description("Updated starter descriptions")
                .displayOrder(9)
                .active(true)
                .build();
        ResponseEntity<ApiResponse<CategoryResponse>> updatedResp = adminCategoryController.updateCategory("appetizers", updateReq);
        assertEquals(200, updatedResp.getStatusCode().value());
        assertEquals("Seasonal Appetizers", updatedResp.getBody().getData().getName());

        // 5. Toggle Status
        ResponseEntity<ApiResponse<CategoryResponse>> statusResp = adminCategoryController.setCategoryStatus("appetizers", Map.of("active", false));
        assertEquals(200, statusResp.getStatusCode().value());
        assertFalse(statusResp.getBody().getData().isActive());

        // 6. Delete unreferenced category succeeds
        ResponseEntity<ApiResponse<Void>> deleteResp = adminCategoryController.deleteCategory("appetizers");
        assertEquals(200, deleteResp.getStatusCode().value());

        // 7. Verify deletion of referenced category (e.g. japanese) is safely blocked
        assertThrows(ConflictException.class, () -> adminCategoryController.deleteCategory("japanese"));
    }
}
