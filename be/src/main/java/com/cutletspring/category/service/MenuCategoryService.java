package com.cutletspring.category.service;

import com.cutletspring.category.dto.CategoryRequest;
import com.cutletspring.category.dto.CategoryResponse;

import java.util.List;

public interface MenuCategoryService {

    List<CategoryResponse> getActiveCategories();

    List<CategoryResponse> getAllCategories();

    CategoryResponse getCategoryById(String id);

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse updateCategory(String id, CategoryRequest request);

    void deleteCategory(String id);
}
