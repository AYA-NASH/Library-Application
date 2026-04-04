package com.luv2code.spring_boot_library.dto;

import java.time.LocalDate;

public sealed interface LoanDtos {

    // Current active loans
    record ShelfResponse(
            Long bookId,
            String title,
            String author,
            String img,
            String description,
            int daysLeft
    ) implements LoanDtos {
    }

    // For the "History": Past loans
    record HistoryResponse(
            Long id,
            String userEmail,
            LocalDate checkoutDate,
            LocalDate returnedDate,
            String title,
            String author,
            String description,
            String img
    ) implements LoanDtos {
    }
}