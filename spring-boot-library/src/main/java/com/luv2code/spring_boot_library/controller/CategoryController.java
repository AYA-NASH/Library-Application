package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("api/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto.DetailsResponse>> getCategories() {
        List<CategoryDto.DetailsResponse> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}/books/count")
    public ResponseEntity<Long> getUsageCount(@PathVariable Long id) {
        long count = categoryService.getBookCountByCategory(id);
        return ResponseEntity.ok(count);
    }


}
