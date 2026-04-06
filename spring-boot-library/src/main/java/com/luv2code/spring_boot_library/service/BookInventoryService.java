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

        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (bookOpt.isEmpty()) {
            throw new ResourceNotFoundException("Book not found");
        }

        if (newTotalCopies < 0) {
            throw new IllegalArgumentException("Copies cannot be negative");
        }

        Book book = bookOpt.get();

        int borrowedCopies = book.getCopies() - book.getCopiesAvailable();

        if (newTotalCopies < borrowedCopies) {
            throw new IllegalArgumentException(
                    "Cannot set copies less than currently borrowed books"
            );
        }

        book.setCopies(newTotalCopies);
        book.setCopiesAvailable(newTotalCopies - borrowedCopies);

        bookRepository.save(book);
    }

}
