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

    private static  final String DEFAULT_BOOK_IMAGE_URL =
            "https://res.cloudinary.com/dg3qdvk22/image/upload/v1766340148/book_cover_default_dark_qjb5bz.png";

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

        String imageUrl = resolveBookImage(image, null);

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

    public void updateBookData(
            Long bookId,
            String title,
            String author,
            String description,
            String category,
            MultipartFile image
    ) throws Exception{
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        if (title != null && !title.isBlank()) {
            book.setTitle(title);
        }

        if (author != null && !author.isBlank()) {
            book.setAuthor(author);
        }

        if (description != null && !description.isBlank()) {
            book.setDescription(description);
        }

        if (category != null && !category.isBlank()) {
            book.setCategory(category);
        }

        String imageUrl = resolveBookImage(image, book.getImg());
        book.setImg(imageUrl);

        bookRepository.save(book);
    }

    private String resolveBookImage(MultipartFile image, String existingImageUrl){
        if(image != null && !image.isEmpty()){
            return imageUploadService.uploadImage(image);
        }

        if(existingImageUrl != null && !existingImageUrl.isBlank()){
            return existingImageUrl;
        }

        return DEFAULT_BOOK_IMAGE_URL;
    }

}
