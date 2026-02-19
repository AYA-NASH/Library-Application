package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.BookSource;
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
    private CloudinaryService cloudinaryService;

    private static  final String DEFAULT_BOOK_IMAGE_URL =
            "https://res.cloudinary.com/dg3qdvk22/image/upload/v1768942485/book_cover_default_dark_nraxu0.png";

    @Autowired
    public AdminService(BookRepository bookRepository, CheckoutRepository checkoutRepository, ReviewRepository reviewRepository, CloudinaryService cloudinaryService){
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
        this.cloudinaryService = cloudinaryService;
    }

    public void deleteBook(Long bookId) throws Exception{
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        if (book.getImagePublicId() != null) {
            cloudinaryService.deleteFile(book.getImagePublicId(), "image");
        }

        if (book.getPdfPublicId() != null) {
            cloudinaryService.deleteFile(book.getPdfPublicId(), "raw");
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
            MultipartFile image,
            MultipartFile pdf
    ) {
        Book newBook = new Book();

        newBook.setTitle(title);
        newBook.setAuthor(author);
        newBook.setDescription(description);
        newBook.setCopies(copies);
        newBook.setCopiesAvailable(copies);
        newBook.setCategory(category);
        newBook.setDataSource(BookSource.INTERNAL);


        if (image != null && !image.isEmpty()) {
            var upload = cloudinaryService.uploadImage(image);
            newBook.setImg(upload.url());
            newBook.setImagePublicId(upload.publicId());
        } else {
            newBook.setImg(DEFAULT_BOOK_IMAGE_URL);
        }

        if (pdf != null && !pdf.isEmpty()) {
            var upload = cloudinaryService.uploadPdf(pdf);
            newBook.setBookUrl(upload.url());
            newBook.setPdfPublicId(upload.publicId());
        }

        bookRepository.save(newBook);
    }

    public void updateBookData(
            Long bookId,
            String title,
            String author,
            String description,
            String category,
            MultipartFile image,
            MultipartFile pdf
    ) throws Exception {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        if (title != null && !title.isBlank()) book.setTitle(title);
        if (author != null && !author.isBlank()) book.setAuthor(author);
        if (description != null && !description.isBlank()) book.setDescription(description);
        if (category != null && !category.isBlank()) book.setCategory(category);

        if (image != null && !image.isEmpty()) {
            if (book.getImagePublicId() != null) {
                cloudinaryService.deleteFile(book.getImagePublicId(), "image");
            }

            var upload = cloudinaryService.uploadImage(image);
            book.setImg(upload.url());
            book.setImagePublicId(upload.publicId());
        }

        if (book.getDataSource() == BookSource.INTERNAL && pdf != null && !pdf.isEmpty()) {
            if (book.getPdfPublicId() != null) {
                cloudinaryService.deleteFile(book.getPdfPublicId(), "raw");
            }

            var upload = cloudinaryService.uploadPdf(pdf);
            book.setBookUrl(upload.url());
            book.setPdfPublicId(upload.publicId());
        }

        bookRepository.save(book);
    }
}
