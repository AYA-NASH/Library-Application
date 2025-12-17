package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@Transactional
public class AdminService {
    private BookRepository bookRepository;
    private CheckoutRepository checkoutRepository;
    private ReviewRepository reviewRepository;
    private ImageUploadService imageUploadService;

    @Autowired
    public AdminService(BookRepository bookRepository, CheckoutRepository checkoutRepository, ReviewRepository reviewRepository, ImageUploadService imageUploadService){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
        this.imageUploadService = imageUploadService;
    }

    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }

        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);

        bookRepository.deleteById(bookId);
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

    public void postBook(
            String title,
            String author,
            String description,
            int copies,
            String category,
            MultipartFile image
    ) {

        String imageUrl = imageUploadService.uploadImage(image);

        Book newBook = new Book();

        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setDescription(description);
        newBook.setCopies(copies);
        newBook.setCopiesAvailable(copies);
        newBook.setCategory(category);
        newBook.setImg(imageUrl);

        System.out.println(newBook.toString());

        bookRepository.save(newBook);
    }
}
