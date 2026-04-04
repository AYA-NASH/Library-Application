package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.BookDtos;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.BookSource;
import com.luv2code.spring_boot_library.entity.Category;
import com.luv2code.spring_boot_library.mapper.BookMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.CategoryRepository;
import com.luv2code.spring_boot_library.repository.CheckoutRepository;
import com.luv2code.spring_boot_library.repository.ReviewRepository;
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
    private final BookMapper bookMapper;

    @Autowired
    public BookManagementService(
            BookRepository bookRepository,
            CheckoutRepository checkoutRepository,
            ReviewRepository reviewRepository,
            CategoryRepository categoryRepository,
            CloudinaryService cloudinaryService,
            BookMapper bookMapper) {
        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
        this.categoryRepository = categoryRepository;
        this.cloudinaryService = cloudinaryService;
        this.bookMapper = bookMapper;
    }

    @Transactional(readOnly = true)
    public BookDtos.BookFileMetadata getBookEditInfo(Long bookId) throws Exception {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        return bookMapper.toEditInfoResponse(book);
    }

    public void postBook(BookDtos.AdminBookRequest request, MultipartFile image, MultipartFile pdf) {
        Book book = bookMapper.toEntity(request, categoryRepository);

        book.setDataSource(BookSource.INTERNAL);

        handleImageLogic(book, image, false);
        handlePdfLogic(book, pdf, false);

        bookRepository.save(book);
    }

    public void updateBookData(
            Long bookId,
            BookDtos.AdminBookRequest request,
            MultipartFile image,
            MultipartFile pdf,
            boolean removeImage,
            boolean removePdf) throws Exception {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        if (request != null) {
            bookMapper.updateEntityFromDto(request, book, categoryRepository);
        }

        handleImageLogic(book, image, removeImage);
        handlePdfLogic(book, pdf, removePdf);

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

    private Set<Category> fetchAndValidateCategories(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(ids));
        if (categories.size() != ids.size()) {
            throw new IllegalArgumentException("One or more category IDs are invalid");
        }
        return categories;
    }

    private void handleImageLogic(Book book, MultipartFile image, boolean removeImage) {
        if (removeImage || (image != null && !image.isEmpty())) {
            if (book.getImagePublicId() != null) {
                cloudinaryService.deleteFile(book.getImagePublicId(), "image");
            }
            book.setImagePublicId(null);
            book.setImg(DEFAULT_BOOK_IMAGE_URL); // Reset to default
        }

        if (image != null && !image.isEmpty()) {
            var upload = cloudinaryService.uploadImage(image);
            book.setImg(upload.url());
            book.setImagePublicId(upload.publicId());
        }
    }

    private void handlePdfLogic(Book book, MultipartFile pdf, boolean removePdf) {
        if (book.getDataSource() != BookSource.INTERNAL) return;

        if (removePdf || (pdf != null && !pdf.isEmpty())) {
            if (book.getPdfPublicId() != null) {
                cloudinaryService.deleteFile(book.getPdfPublicId(), "raw");
            }
            book.setBookUrl(null);
            book.setPdfPublicId(null);
        }

        if (pdf != null && !pdf.isEmpty()) {
            var upload = cloudinaryService.uploadPdf(pdf);
            book.setBookUrl(upload.url());
            book.setPdfPublicId(upload.publicId());
        }
    }


}
