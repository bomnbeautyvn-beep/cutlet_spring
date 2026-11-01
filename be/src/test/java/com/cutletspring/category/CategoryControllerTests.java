package com.cutletspring.category;

import com.cutletspring.category.controller.CategoryController;
import com.cutletspring.category.dto.CategoryResponse;
import com.cutletspring.category.service.MenuCategoryService;
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
class CategoryControllerTests {

    @Autowired
    private CategoryController categoryController;

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
}

