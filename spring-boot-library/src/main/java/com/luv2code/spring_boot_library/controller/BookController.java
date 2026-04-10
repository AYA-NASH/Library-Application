package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.BookCatalogService;
import com.luv2code.spring_boot_library.service.BookLoanService;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Validated
public class BookController {

    private final BookLoanService bookLoanService;
    private final BookCatalogService bookCatalogService;

    @GetMapping("/all")
    public Page<BookDtos.BookResponse> getBooksPageable(Pageable pageable) {
        return bookCatalogService.getBooks(pageable);
    }

    @GetMapping("/{bookId}")
    public BookDtos.BookResponse getBookById(@PathVariable @Positive Long bookId) {
        return bookCatalogService.getBookById(bookId);
    }

    @GetMapping("/search/findByTitleContaining")
    public Page<BookDtos.BookResponse> searchByTitle(
            @RequestParam @NotBlank @Size(max = 100) String title,
            Pageable pageable
    ) {
        return bookCatalogService.searchBooksByTitle(title, pageable);
    }

    @GetMapping("/search/findByCategoryId")
    public Page<BookDtos.BookResponse> searchBooksByCategoryIds(
            @RequestParam @Positive Long categoryId,
            Pageable pageable
    ) {
        return bookCatalogService.searchBooksByCategoryId(categoryId, pageable);
    }

    @GetMapping("/search/findByCategories")
    public Page<BookDtos.BookResponse> getBooksByCategories(
            @RequestParam List<Long> categoryIds,
            Pageable pageable
    ) {
        return bookCatalogService.getBooksByCategories(categoryIds, pageable);
    }

    @GetMapping("secure/current-loans")
    public Page<LoanDtos.ShelfResponse> currentLoans(@AuthenticationPrincipal UserPrincipal currentUser, Pageable pageable) {
        return bookLoanService.currentLoans(currentUser.getUsername(), pageable);
    }

    @GetMapping("/secure/current-loans/count")
    public int currentLoansCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        return bookLoanService.countCheckouts(currentUser.getUsername());
    }

    @GetMapping("/secure/is-checked-out/byuser")
    public boolean isBookCheckedOutByUser(@RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        return bookLoanService.isBookCheckedOutByUser(currentUser.getUsername(), bookId);
    }

    @PutMapping("/secure/checkout")
    public LoanDtos.ShelfResponse checkoutBook(
            @RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return bookLoanService.checkoutBook(currentUser.getUsername(), bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestParam @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        bookLoanService.returnBook(currentUser.getUsername(), bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        bookLoanService.renewLoan(currentUser.getUsername(), bookId);
    }
}
