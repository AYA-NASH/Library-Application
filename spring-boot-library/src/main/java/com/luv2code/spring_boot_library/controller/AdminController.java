package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.requestmodel.AdminBookRequest;
import com.luv2code.spring_boot_library.requestmodel.AdminCategoryRequest;
import com.luv2code.spring_boot_library.responsemodel.AdminBookEditInfoResponse;
import com.luv2code.spring_boot_library.responsemodel.CategoryResponse;
import com.luv2code.spring_boot_library.service.BookCatalogService;
import com.luv2code.spring_boot_library.service.BookInventoryService;
import com.luv2code.spring_boot_library.service.BookManagementService;
import com.luv2code.spring_boot_library.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CategoryService categoryService;
    private final BookManagementService bookManagementService;
    private final BookInventoryService bookInventoryService;
    private final BookCatalogService bookCatalogService;

    @Autowired
    public AdminController(
            CategoryService categoryService,
            BookManagementService bookManagementService,
            BookInventoryService bookInventoryService,
            BookCatalogService bookCatalogService) {
        this.categoryService = categoryService;
        this.bookManagementService = bookManagementService;
        this.bookInventoryService = bookInventoryService;
        this.bookCatalogService = bookCatalogService;
    }

    @PutMapping("/secure/update/book/quantity")
    public void updateBookQuantity(
            @RequestParam Long bookId,
            @RequestParam int quantity
    ) throws Exception {

        bookInventoryService.updateBookQuantity(bookId, quantity);
    }

    @GetMapping("/secure/book/{bookId}/edit-info")
    public ResponseEntity<AdminBookEditInfoResponse> getBookEditInfo(@PathVariable Long bookId) throws Exception {
        AdminBookEditInfoResponse response = bookManagementService.getBookEditInfo(bookId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/secure/add/book", consumes = "multipart/form-data")
    public ResponseEntity<?> postBook(
            @ModelAttribute AdminBookRequest request,
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "pdf", required = false) MultipartFile pdf) {

        bookManagementService.postBook(request, image, pdf);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/secure/add/category")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody AdminCategoryRequest request) throws Exception {
        CategoryResponse newCategory = categoryService.createCategory(request);
        return ResponseEntity.ok(newCategory);
    }

    @PutMapping(value = "/secure/update/book/data/{bookId}", consumes = "multipart/form-data")
    public ResponseEntity<Void> updateBook(
            @PathVariable Long bookId,
            @ModelAttribute AdminBookRequest request,
            @RequestParam(required = false) MultipartFile image,
            @RequestParam(required = false) MultipartFile pdf,
            @RequestParam(value = "removeImage", required = false) Boolean removeImage,
            @RequestParam(value = "removePdf", required = false) Boolean removePdf) throws Exception {

        bookManagementService.updateBookData(bookId, request, image, pdf,
                Boolean.TRUE.equals(removeImage),
                Boolean.TRUE.equals(removePdf));

        return ResponseEntity.ok().build();
    }

    @PutMapping("/secure/update/category/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody AdminCategoryRequest request
    ) throws Exception {
        CategoryResponse updatedCategory = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestParam Long bookId) throws Exception {

        bookManagementService.deleteBook(bookId);
    }

    @DeleteMapping("/secure/delete/category/{id}")
    public void deleteCategory(@PathVariable Long id) throws Exception {

        categoryService.deleteCategory(id);
    }
}
