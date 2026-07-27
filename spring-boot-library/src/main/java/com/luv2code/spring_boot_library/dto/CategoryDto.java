package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public sealed interface CategoryDto {

    record CreateRequest(
            @NotBlank(message = "Category name cannot be empty")
            @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
            String name
    ) implements CategoryDto {
    }

    // For Listing/Admin: { id, name, booksCount }
    record DetailsResponse(
            Long id,
            String name,
            long booksCount
    ) implements CategoryDto {
    }

    // For Book relationships: { id, name }
    record Reference(
            Long id,
            String name
    ) implements CategoryDto {
    }

    record CategorySummaryResponse(
            long totalCategories,
            String largestCategoryName,
            long largestCategoryCount,
            double avgBooksPerCategory,
            long emptyCategoriesCount,
            long uncategorizedBooksCount
    ) implements CategoryDto {
    }
}
