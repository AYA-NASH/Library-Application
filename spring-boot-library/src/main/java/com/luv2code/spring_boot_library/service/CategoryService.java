package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.CategoryRepository;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.requestmodel.AdminCategoryRequest;
import com.luv2code.spring_boot_library.responsemodel.CategoryResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public CategoryResponse createCategory(AdminCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Category already exists");
        }

        Category newCategory = new Category();
        newCategory.setName(request.getName());
        Category savedCategory = categoryRepository.save(newCategory);

        return new CategoryResponse(savedCategory.getId(),
                savedCategory.getName(),
                0L
        );
    }

    public CategoryResponse updateCategory(Long id, AdminCategoryRequest request) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        String name = request.getName();

        if (name == null || name.isBlank()) {
            throw new RuntimeException("Invalid Category Update, Provide a proper name");
        }

        category.setName(name);
        Category updatedCategory = categoryRepository.save(category);

        long booksCount = updatedCategory.getBooks() != null ? updatedCategory.getBooks().size() : 0L;

        return new CategoryResponse(
                updatedCategory.getId(),
                updatedCategory.getName(),
                booksCount
        );
    }

    public void deleteCategory(Long id) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow();

        new HashSet<>(category.getBooks()).forEach(book -> {
            book.removeCategory(category);
        });

        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public long getBookCountByCategory(Long id) {
        return categoryRepository.countBooksByCategoryId(id);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAllWithCount();
    }
}
