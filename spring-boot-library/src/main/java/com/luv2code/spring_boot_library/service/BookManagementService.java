package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CategoryRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.ReviewRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.BookSource;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.requestmodel.AdminBookRequest;
import com.luv2code.spring_boot_library.responsemodel.AdminBookEditInfoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class BookManagementService {

    private static final String DEFAULT_BOOK_IMAGE_URL =
            "https://res.cloudinary.com/dg3qdvk22/image/upload/v1768942485/book_cover_default_dark_nraxu0.png";
    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final ReviewRepository reviewRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    @Autowired
    public BookManagementService(
            BookRepository bookRepository,
            CheckoutRepository checkoutRepository,
            ReviewRepository reviewRepository,
            CategoryRepository categoryRepository,
            CloudinaryService cloudinaryService) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
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

    @Transactional(readOnly = true)
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

    public void postBook(AdminBookRequest request, MultipartFile image, MultipartFile pdf) {

        if (request == null || request.getTitle() == null || request.getTitle().isBlank()
                || request.getAuthor() == null || request.getAuthor().isBlank()
                || request.getDescription() == null
                || request.getCategoryIds() == null || request.getCategoryIds().isEmpty()
                || request.getCopies() == null || request.getCopies() < 0) {
            throw new IllegalArgumentException("Missing or invalid required fields: title, author, description, category, copies");
        }

        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

        if (categories.size() != request.getCategoryIds().size()) {
            throw new IllegalArgumentException("One or more category IDs are invalid");
        }

        Book newBook = new Book();

        newBook.setTitle(request.getTitle());
        newBook.setAuthor(request.getAuthor());
        newBook.setDescription(request.getDescription());
        newBook.setCopies(request.getCopies());
        newBook.setCopiesAvailable(request.getCopies());
        newBook.setCategories(categories);

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
            if (request.getDescription() != null && !request.getDescription().isBlank())
                book.setDescription(request.getDescription());

            if (request.getCategoryIds() != null) {
                Set<Category> categories = new HashSet<>(categoryRepository.findAllById(request.getCategoryIds()));

                if (categories.size() != request.getCategoryIds().size()) {
                    throw new IllegalArgumentException("One or more category IDs are invalid");
                }
                book.getCategories().clear();
                book.getCategories().addAll(categories);
            }
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

    public void deleteBook(Long bookId) throws Exception {
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


}
