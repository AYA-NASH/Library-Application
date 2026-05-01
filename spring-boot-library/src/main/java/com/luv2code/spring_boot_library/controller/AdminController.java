package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.service.BookInventoryService;
import com.luv2code.spring_boot_library.service.BookManagementService;
import com.luv2code.spring_boot_library.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.luv2code.spring_boot_library.dto.ErrorsDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/secure")
@RequiredArgsConstructor
@Validated
@Tag(name = "Library Admin", description = "Endpoints for managing the library catalog and inventory")
public class AdminController {

    private final CategoryService categoryService;
    private final BookManagementService bookManagementService;
    private final BookInventoryService bookInventoryService;

    @PutMapping("/update/book/quantity")
    @Operation(summary = "Update book quantity", description = "Adjusts the available stock of a specific book.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantity successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid input or book not found", 
                         content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public void updateBookQuantity(
            @RequestParam @Parameter(description = "ID of the book to update", example = "1") @Positive Long bookId,
            @RequestParam @Parameter(description = "New total quantity", example = "10") @Positive int quantity
    ) {

        bookInventoryService.updateBookQuantity(bookId, quantity);
    }

    @GetMapping("/book/{bookId}/edit-info")
    public ResponseEntity<BookDtos.BookFileMetadata> getBookEditInfo(@PathVariable @Positive Long bookId) {
        BookDtos.BookFileMetadata response = bookManagementService.getBookEditInfo(bookId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/add/book", consumes = "multipart/form-data")
    @Operation(summary = "Add a new book", description = "Uploads a new book to the library, including an image and optional PDF.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book successfully added"),
            @ApiResponse(responseCode = "400", description = "Invalid book data or missing image", 
                         content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public ResponseEntity<?> postBook(
            @Valid @ModelAttribute @Parameter(description = "Book details") BookDtos.AdminBookRequest request,
            @RequestParam("image") @Parameter(description = "Book cover image file") MultipartFile image,
            @RequestParam(value = "pdf", required = false) @Parameter(description = "Book PDF file (optional)") MultipartFile pdf) {

        bookManagementService.postBook(request, image, pdf);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/add/category")
    public ResponseEntity<CategoryDto.DetailsResponse> createCategory(@Valid @RequestBody CategoryDto.CreateRequest request) {
        CategoryDto.DetailsResponse newCategory = categoryService.createCategory(request);
        return ResponseEntity.ok(newCategory);
    }

    @PutMapping(value = "/update/book/data/{bookId}", consumes = "multipart/form-data")
    public ResponseEntity<Void> updateBook(
            @PathVariable @Positive Long bookId,
            @ModelAttribute BookDtos.AdminBookRequest request,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile pdf,
            @RequestParam(value = "removeImage", required = false) Boolean removeImage,
            @RequestParam(value = "removePdf", required = false) Boolean removePdf) {

        bookManagementService.updateBookData(bookId, request, image, pdf,
                Boolean.TRUE.equals(removeImage),
                Boolean.TRUE.equals(removePdf));

        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/category/{id}")
    public ResponseEntity<CategoryDto.DetailsResponse> updateCategory(
            @PathVariable @Positive Long id,
            @Valid @RequestBody CategoryDto.CreateRequest request
    ) {
        CategoryDto.DetailsResponse updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/delete/book/{bookId}")
    @Operation(summary = "Delete a book", description = "Permanently removes a book from the library catalog.")
    public void deleteBook(@PathVariable @Positive Long bookId) {
        bookManagementService.deleteBook(bookId);
    }

    @DeleteMapping("/delete/category/{id}")
    public void deleteCategory(@PathVariable @Positive Long id) {
        categoryService.deleteCategory(id);
    }
}
