package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.mapper.CategoryMapper;
import com.luv2code.spring_boot_library.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public CategoryDto.DetailsResponse createCategory(CategoryDto.CreateRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new RuntimeException("Category already exists");
        }

        Category newCategory = categoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(newCategory);

        return categoryMapper.toDetailsResponse(savedCategory);
    }

    public CategoryDto.DetailsResponse updateCategory(Long id, CategoryDto.CreateRequest request) throws Exception {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category Not Found"));

        categoryMapper.updateEntityFromDto(request, category);

        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toDetailsResponse(updatedCategory);
    }

    public void deleteCategory(Long id) throws Exception {
        Category category = categoryRepository.findById(id).orElseThrow();

        new HashSet<>(category.getBooks()).forEach(book -> book.removeCategory(category));

        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public long getBookCountByCategory(Long id) {
        return categoryRepository.countBooksByCategoryId(id);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto.DetailsResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categoryMapper.toDetailsResponseList(categories);
    }
}
