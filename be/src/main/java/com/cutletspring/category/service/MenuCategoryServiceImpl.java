package com.cutletspring.category.service;

import com.cutletspring.category.dto.CategoryRequest;
import com.cutletspring.category.dto.CategoryResponse;
import com.cutletspring.category.entity.MenuCategory;
import com.cutletspring.category.repository.MenuCategoryRepository;
import com.cutletspring.shared.exception.ConflictException;
import com.cutletspring.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuCategoryServiceImpl implements MenuCategoryService {

    private final MenuCategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(String id) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByCode(request.getCode())) {
            throw new ConflictException("Category with code '" + request.getCode() + "' already exists");
        }

        MenuCategory category = MenuCategory.builder()
                .id(request.getCode().toLowerCase().trim())
                .code(request.getCode().toLowerCase().trim())
                .name(request.getName().trim())
                .description(request.getDescription())
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        MenuCategory saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        if (!category.getCode().equalsIgnoreCase(request.getCode()) && categoryRepository.existsByCode(request.getCode())) {
            throw new ConflictException("Category with code '" + request.getCode() + "' already exists");
        }

        category.setCode(request.getCode().toLowerCase().trim());
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getActive() != null) {
            category.setActive(request.getActive());
        }

        MenuCategory updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(String id) {
        MenuCategory category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        // Soft-delete to preserve relational integrity
        category.setActive(false);
        categoryRepository.save(category);
    }

    private CategoryResponse mapToResponse(MenuCategory category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .code(category.getCode())
                .name(category.getName())
                .description(category.getDescription())
                .displayOrder(category.getDisplayOrder())
                .active(category.isActive())
                .build();
    }
}

