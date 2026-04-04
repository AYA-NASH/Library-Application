package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.service.BookCatalogService;
import com.luv2code.spring_boot_library.service.BookLoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookLoanService bookLoanService;
    private final BookCatalogService bookCatalogService;

    @GetMapping("/all")
    public Page<BookDtos.BookResponse> getBooksPageable(Pageable pageable) {
        return bookCatalogService.getBooks(pageable);
    }

    @GetMapping("/{bookId}")
    public BookDtos.BookResponse getBookById(@PathVariable Long bookId) throws Exception {
        return bookCatalogService.getBookById(bookId);
    }

    @GetMapping("/search/findByTitleContaining")
    public Page<BookDtos.BookResponse> searchByTitle(@RequestParam String title, Pageable pageable) {
        return bookCatalogService.searchBooksByTitle(title, pageable);
    }

    @GetMapping("/search/findByCategoryId")
    public Page<BookDtos.BookResponse> searchBooksByCategoryIds(@RequestParam Long categoryId, Pageable pageable) {
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
    public List<LoanDtos.ShelfResponse> currentLoans() {
        return bookLoanService.currentLoans(getAuthenticatedUserEmail());
    }

    @GetMapping("/secure/current-loans/count")
    public int currentLoansCount() {
        return bookLoanService.countCheckouts(getAuthenticatedUserEmail());
    }

    @GetMapping("/secure/is-checked-out/byuser")
    public boolean isBookCheckedOutByUser(@RequestParam("bookId") Long bookId) {
        return bookLoanService.isBookCheckedOutByUser(getAuthenticatedUserEmail(), bookId);
    }

    @PutMapping("/secure/checkout")
    public LoanDtos.ShelfResponse checkoutBook(@RequestParam("bookId") Long bookId) throws Exception {
        return bookLoanService.checkoutBook(getAuthenticatedUserEmail(), bookId);
    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestParam Long bookId) throws Exception {
        bookLoanService.returnBook(getAuthenticatedUserEmail(), bookId);
    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestParam("bookId") Long bookId) throws Exception {
        bookLoanService.renewLoan(getAuthenticatedUserEmail(), bookId);
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}
