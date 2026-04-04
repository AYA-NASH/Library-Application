package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.CategoryRepository;
import com.luv2code.spring_boot_library.repository.CheckoutRepository;
import com.luv2code.spring_boot_library.repository.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class BookInventoryService {

    private final BookRepository bookRepository;

    @Autowired
    public BookInventoryService(BookRepository bookRepository, CheckoutRepository checkoutRepository, ReviewRepository reviewRepository, CategoryRepository categoryRepository, CloudinaryService cloudinaryService) {
        this.bookRepository = bookRepository;

    }

    public void updateBookQuantity(Long bookId, int newTotalCopies) throws Exception {

        Optional<Book> bookOpt = bookRepository.findById(bookId);

        if (bookOpt.isEmpty()) {
            throw new Exception("Book not found");
        }

        if (newTotalCopies < 0) {
            throw new Exception("Copies cannot be negative");
        }

        Book book = bookOpt.get();

        int borrowedCopies = book.getCopies() - book.getCopiesAvailable();

        if (newTotalCopies < borrowedCopies) {
            throw new Exception(
                    "Cannot set copies less than currently borrowed books"
            );
        }

        book.setCopies(newTotalCopies);
        book.setCopiesAvailable(newTotalCopies - borrowedCopies);

        bookRepository.save(book);
    }

}
