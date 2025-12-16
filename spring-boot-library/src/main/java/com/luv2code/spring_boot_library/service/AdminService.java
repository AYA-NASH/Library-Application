package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.requestmodel.AddBookRequest;
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

    public void decreaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable() <= 0 || book.get().getCopies() <= 0){
            throw new Exception("Book not found or quantity locked");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        book.get().setCopies(book.get().getCopies() - 1);

        bookRepository.save(book.get());

    }

    public void increaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        book.get().setCopies(book.get().getCopies() + 1);

        bookRepository.save(book.get());
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
