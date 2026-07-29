package com.luv2code.spring_boot_library.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.luv2code.spring_boot_library.entity.BookSource;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Set;

public sealed interface BookDtos {
    @Schema(description = "Request object for adding or updating a book by an administrator")
    record AdminBookRequest(
            @NotBlank(message = "Title is required")
            String title,
            String author,
            String description,
            Integer copies,
            @NotEmpty(message = "At least one category is required")
            Set<Long> categoryIds
    ) implements BookDtos {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    record BookFileMetadata(
            boolean hasPdf,
            boolean hasImage,
            String imageUrl,
            String pdfFilename,
            String imageFilename
    ) implements BookDtos {
    }

    @Schema(description = "Detailed information about a book in the catalog")
    record BookResponse(
            @Schema(example = "1")
            Long id,
            @Schema(example = "The Great Gatsby")
            String title,
            @Schema(example = "F. Scott Fitzgerald")
            String author,
            @Schema(example = "A classic novel about the American Dream...")
            String description,
            @Schema(example = "https://images.cloudinary.com/...")
            String imgUrl,
            Set<CategoryDto.Reference> categories,
            BookSource dataSource,
            @Schema(example = "10")
            Integer copies,
            @Schema(example = "7")
            Integer copiesAvailable,
            String status
    ) implements BookDtos {
    }

    record DigitalAccessResponse(
            String url,
            String source,
            String mode
    ) implements BookDtos {
    }
}
