package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.service.CategoryService;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequiredArgsConstructor
@RequestMapping("api/categories/public")
@Tag(name = "User Interaction", description = "Endpoints for book categories")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping
    public Page<CategoryDto.DetailsResponse> getCategories(Pageable pageable) {
        return categoryService.getAllCategories(pageable);
    }

    @GetMapping("/{id}/books/count")
    public ResponseEntity<Long> getUsageCount(@PathVariable @Positive Long id) {
        long count = categoryService.getBookCountByCategory(id);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/references")
    public List<CategoryDto.Reference> getCategoriesReferences() {
        return categoryService.getCategoriesReferences();
    }

}
