package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.exception.DuplicateResourceException;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.CategoryMapper;
import com.luv2code.spring_boot_library.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryDto.DetailsResponse createCategory(CategoryDto.CreateRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new DuplicateResourceException("Category already exists");
        }

        Category newCategory = categoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(newCategory);

        return categoryMapper.toDetailsResponse(savedCategory);
    }

    public CategoryDto.DetailsResponse updateCategory(Long id, CategoryDto.CreateRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category Not Found"));

        categoryMapper.updateEntityFromDto(request, category);

        Category updatedCategory = categoryRepository.save(category);

        return categoryMapper.toDetailsResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category Not Found"));

        new HashSet<>(category.getBooks()).forEach(book -> book.removeCategory(category));

        categoryRepository.delete(category);
    }

    @Transactional(readOnly = true)
    public long getBookCountByCategory(Long id) {
        return categoryRepository.countBooksByCategoryId(id);
    }

    @Transactional(readOnly = true)
    public Page<CategoryDto.DetailsResponse> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(categoryMapper::toDetailsResponse);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto.Reference> getCategoriesReferences() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toCategoryReference)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto.CategorySummaryResponse getCategorySummary() {
        long totalCategories = categoryRepository.countTotalCategories();
        long emptyCategoriesCount = categoryRepository.countEmptyCategories();
        long uncategorizedBooksCount = categoryRepository.countUncategorizedBooks();
        Double avgBooks = categoryRepository.findAverageBooksPerCategory();

        List<Object[]> largestResult = categoryRepository.findLargestCategory();
        String largestCategoryName = "N/A";
        long largestCategoryCount = 0;

        if (!largestResult.isEmpty()) {
            Object[] row = largestResult.get(0);
            largestCategoryName = (String) row[0];
            largestCategoryCount = (Long) row[1];
        }

        double formattedAvg = (avgBooks != null) ? Math.round(avgBooks * 10.0) / 10.0 : 0.0;

        return new CategoryDto.CategorySummaryResponse(
                totalCategories,
                largestCategoryName,
                largestCategoryCount,
                formattedAvg,
                emptyCategoriesCount,
                uncategorizedBooksCount
        );
    }
}
