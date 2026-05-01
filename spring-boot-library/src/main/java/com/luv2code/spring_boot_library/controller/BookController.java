package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.ErrorsDto;
import com.luv2code.spring_boot_library.service.BookCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books/public")
@RequiredArgsConstructor
@Validated
@Tag(name = "Book Discovery", description = "Endpoints for searching and browsing the library catalog")
public class BookController {

    private final BookCatalogService bookCatalogService;

    @GetMapping("/all")
    @Operation(summary = "Get all books", description = "Retrieves a paginated list of all books in the library catalog.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of books"),
            @ApiResponse(responseCode = "400", description = "Invalid pageable parameters", content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public Page<BookDtos.BookResponse> getBooksPageable(
            @Parameter(description = "Pagination and sorting information") Pageable pageable) {
        return bookCatalogService.getBooks(pageable);
    }

    @GetMapping("/{bookId}")
    @Operation(summary = "Get book by ID", description = "Retrieves detailed information about a specific book.")
    public BookDtos.BookResponse getBookById(
            @PathVariable @Parameter(description = "ID of the book to retrieve", example = "1") @Positive Long bookId) {
        return bookCatalogService.getBookById(bookId);
    }

    @GetMapping("/search/findByTitleContaining")
    @Operation(summary = "Search books by title", description = "Finds books whose titles contain the specified string.")
    public Page<BookDtos.BookResponse> searchByTitle(
            @RequestParam @Parameter(description = "Part of the book title to search for", example = "Java") @NotBlank @Size(max = 100) String title,
            Pageable pageable) {
        return bookCatalogService.searchBooksByTitle(title, pageable);
    }

    @GetMapping("/search/findByCategoryId")
    @Operation(summary = "Search books by category ID", description = "Finds books belonging to a specific category.")
    public Page<BookDtos.BookResponse> searchBooksByCategoryIds(
            @RequestParam @Parameter(description = "ID of the category", example = "2") @Positive Long categoryId,
            Pageable pageable) {
        return bookCatalogService.searchBooksByCategoryId(categoryId, pageable);
    }

    @GetMapping("/search/findByCategories")
    @Operation(summary = "Search books by multiple category IDs", description = "Finds books that belong to any of the specified categories.")
    public Page<BookDtos.BookResponse> getBooksByCategories(
            @RequestParam @Parameter(description = "List of category IDs") List<Long> categoryIds,
            Pageable pageable) {
        return bookCatalogService.getBooksByCategories(categoryIds, pageable);
    }
}
