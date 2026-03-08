package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.BookSource;
import com.luv2code.spring_boot_library.requestmodel.AdminBookRequest;
import com.luv2code.spring_boot_library.responsemodel.AdminBookEditInfoResponse;
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

    public void postBook(AdminBookRequest request, MultipartFile image, MultipartFile pdf) {

        if (request == null || request.getTitle() == null || request.getTitle().isBlank()
                || request.getAuthor() == null || request.getAuthor().isBlank()
                || request.getDescription() == null 
                || request.getCategory() == null || request.getCategory().isBlank()
                || request.getCopies() == null || request.getCopies() < 0) {
            throw new IllegalArgumentException("Missing or invalid required fields: title, author, description, category, copies");
        }

        Book newBook = new Book();

        newBook.setTitle(request.getTitle());
        newBook.setAuthor(request.getAuthor());
        newBook.setDescription(request.getDescription());
        newBook.setCopies(request.getCopies());
        newBook.setCopiesAvailable(request.getCopies());
        newBook.setCategory(request.getCategory());

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
            AdminBookRequest request,
            MultipartFile image,
            MultipartFile pdf,
            boolean removeImage,
            boolean removePdf) throws Exception {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        if (request != null) {
            if (request.getTitle() != null && !request.getTitle().isBlank()) book.setTitle(request.getTitle());
            if (request.getAuthor() != null && !request.getAuthor().isBlank()) book.setAuthor(request.getAuthor());
            if (request.getDescription() != null && !request.getDescription().isBlank()) book.setDescription(request.getDescription());
            if (request.getCategory() != null && !request.getCategory().isBlank()) book.setCategory(request.getCategory());
        }

        if (removeImage || (image != null && !image.isEmpty())) {
            if (book.getImagePublicId() != null) {
                cloudinaryService.deleteFile(book.getImagePublicId(), "image");
            }
            book.setImagePublicId(null);
        }

        if (removeImage) {
            book.setImg(DEFAULT_BOOK_IMAGE_URL);
        } else if (image != null && !image.isEmpty()) {
            var upload = cloudinaryService.uploadImage(image);
            book.setImg(upload.url());
            book.setImagePublicId(upload.publicId());
        }

        if (book.getDataSource() == BookSource.INTERNAL) {
            if (removePdf) {
                if (book.getPdfPublicId() != null) {
                    cloudinaryService.deleteFile(book.getPdfPublicId(), "raw");
                }
                book.setBookUrl(null);
                book.setPdfPublicId(null);
            } else if (pdf != null && !pdf.isEmpty()) {
                if (book.getPdfPublicId() != null) {
                    cloudinaryService.deleteFile(book.getPdfPublicId(), "raw");
                }
                var upload = cloudinaryService.uploadPdf(pdf);
                book.setBookUrl(upload.url());
                book.setPdfPublicId(upload.publicId());
            }
        }

        bookRepository.save(book);
    }

    public AdminBookEditInfoResponse getBookEditInfo(Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        boolean hasPdf = book.getBookUrl() != null && !book.getBookUrl().isBlank();
        boolean hasImage = book.getImg() != null && !book.getImg().isBlank();
        
        String imageUrl = book.getImg();
        String pdfFilename = hasPdf ? filenameFromUrl(book.getBookUrl()) : null;
        String imageFilename = hasImage ? filenameFromUrl(book.getImg()) : null;

        return new AdminBookEditInfoResponse(hasPdf, hasImage, imageUrl, pdfFilename, imageFilename);
    }

    private static String filenameFromUrl(String url) {
        if (url == null || url.isBlank()) return null;
        int last = url.lastIndexOf('/');
        if (last >= 0 && last < url.length() - 1) {
            String segment = url.substring(last + 1);
            int q = segment.indexOf('?');
            return q > 0 ? segment.substring(0, q) : segment;
        }
        return "file";
    }
}
