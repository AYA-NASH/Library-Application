package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.CategoryDto;
import com.luv2code.spring_boot_library.service.BookInventoryService;
import com.luv2code.spring_boot_library.service.BookManagementService;
import com.luv2code.spring_boot_library.service.CategoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Validated
public class AdminController {

    private final CategoryService categoryService;
    private final BookManagementService bookManagementService;
    private final BookInventoryService bookInventoryService;

    @PutMapping("/secure/update/book/quantity")
    public void updateBookQuantity(
            @RequestParam @Positive Long bookId,
            @RequestParam @Positive int quantity
    ) {

        bookInventoryService.updateBookQuantity(bookId, quantity);
    }

    @GetMapping("/secure/book/{bookId}/edit-info")
    public ResponseEntity<BookDtos.BookFileMetadata> getBookEditInfo(@PathVariable @Positive Long bookId) {
        BookDtos.BookFileMetadata response = bookManagementService.getBookEditInfo(bookId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/secure/add/book", consumes = "multipart/form-data")
    public ResponseEntity<?> postBook(
            @Valid @ModelAttribute BookDtos.AdminBookRequest request,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf) {

        bookManagementService.postBook(request, image, pdf);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/secure/add/category")
    public ResponseEntity<CategoryDto.DetailsResponse> createCategory(@Valid @RequestBody CategoryDto.CreateRequest request) {
        CategoryDto.DetailsResponse newCategory = categoryService.createCategory(request);
        return ResponseEntity.ok(newCategory);
    }

    @PutMapping(value = "/secure/update/book/data/{bookId}", consumes = "multipart/form-data")
    public ResponseEntity<Void> updateBook(
            @PathVariable @Positive Long bookId,
            @Valid @ModelAttribute BookDtos.AdminBookRequest request,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile pdf,
            @RequestParam(value = "removeImage", required = false) Boolean removeImage,
            @RequestParam(value = "removePdf", required = false) Boolean removePdf) {

        bookManagementService.updateBookData(bookId, request, image, pdf,
                Boolean.TRUE.equals(removeImage),
                Boolean.TRUE.equals(removePdf));

        return ResponseEntity.ok().build();
    }

    @PutMapping("/secure/update/category/{id}")
    public ResponseEntity<CategoryDto.DetailsResponse> updateCategory(
            @PathVariable @Positive Long id,
            @Valid @RequestBody CategoryDto.CreateRequest request
    ) {
        CategoryDto.DetailsResponse updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestParam @Positive Long bookId) {

        bookManagementService.deleteBook(bookId);
    }

    @DeleteMapping("/secure/delete/category/{id}")
    public void deleteCategory(@PathVariable @Positive Long id) {

        categoryService.deleteCategory(id);
    }
}
