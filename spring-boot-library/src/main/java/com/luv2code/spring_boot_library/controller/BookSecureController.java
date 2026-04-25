package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.BookLoanService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books/secure")
@RequiredArgsConstructor
@Tag(name = "Borrowing & Shelf", description = "Checkouts, returns, renewals, and loan history.\n")
public class BookSecureController {
    private final BookLoanService bookLoanService;

    @GetMapping("/current-loans")
    @Operation(summary = "Get current loans", description = "Retrieves the list of books currently checked out by the authenticated user.")
    public Page<LoanDtos.ShelfResponse> currentLoans(@AuthenticationPrincipal UserPrincipal currentUser, Pageable pageable) {
        return bookLoanService.currentLoans(currentUser.getUsername(), pageable);
    }

    @GetMapping("/current-loans/count")
    public int currentLoansCount(@AuthenticationPrincipal UserPrincipal currentUser) {
        return bookLoanService.countCheckouts(currentUser.getUsername());
    }

    @GetMapping("/is-checked-out/byuser")
    public boolean isBookCheckedOutByUser(@RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        return bookLoanService.isBookCheckedOutByUser(currentUser.getUsername(), bookId);
    }

    @PutMapping("/checkout")
    @Operation(summary = "Checkout a book", description = "Checks out a book for the authenticated user.")
    public LoanDtos.ShelfResponse checkoutBook(
            @RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        return bookLoanService.checkoutBook(currentUser.getUsername(), bookId);
    }

    @PutMapping("/return")
    @Operation(summary = "Return a book", description = "Returns a previously checked-out book.")
    public void returnBook(@RequestParam @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        bookLoanService.returnBook(currentUser.getUsername(), bookId);
    }

    @PutMapping("/renew/loan")
    public void renewLoan(@RequestParam("bookId") @Positive Long bookId, @AuthenticationPrincipal UserPrincipal currentUser) {
        bookLoanService.renewLoan(currentUser.getUsername(), bookId);
    }
}
