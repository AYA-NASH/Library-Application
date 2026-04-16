package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BookInventoryService {

    private final BookRepository bookRepository;

    public void updateBookQuantity(Long bookId, int newTotalCopies) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with ID: " + bookId));

        int currentTotal = (book.getCopies() != null) ? book.getCopies() : 0;
        int currentAvailable = (book.getCopiesAvailable() != null) ? book.getCopiesAvailable() : 0;

        int borrowedCopies = currentTotal - currentAvailable;

        if (newTotalCopies < borrowedCopies) {
            throw new IllegalArgumentException("Cannot set total copies (" + newTotalCopies +
                    ") lower than borrowed copies (" + borrowedCopies + ")");
        }

        book.setCopies(newTotalCopies);
        book.setCopiesAvailable(newTotalCopies - borrowedCopies);

        bookRepository.save(book);
    }

}
