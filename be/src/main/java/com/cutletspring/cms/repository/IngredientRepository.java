package com.cutletspring.cms.repository;

import com.cutletspring.cms.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, String> {

    List<Ingredient> findAllByOrderByDisplayOrderAsc();

    List<Ingredient> findAllByIsActiveTrueOrderByDisplayOrderAsc();
}

