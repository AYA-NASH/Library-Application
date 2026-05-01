package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.ReviewDto;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.Review;
import com.luv2code.spring_boot_library.exception.DuplicateResourceException;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.ReviewMapper;
import com.luv2code.spring_boot_library.repository.BookRepository;
import com.luv2code.spring_boot_library.repository.ReviewRepository;
import com.luv2code.spring_boot_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewMapper reviewMapper;

    public void postReview(Long userId, Long bookId, ReviewDto.ReviewRequest request) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User Not Found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        if (reviewRepository.existsByUserIdAndBookId(user.getId(), bookId))
            throw new DuplicateResourceException("User Already reviewed this book");

        Review review = reviewMapper.toEntity(request);
        review.setUser(user);
        review.setBook(book);

        reviewRepository.save(review);
    }

    public Boolean userReviewListed(Long userId, Long bookId) {
        Review validateReview = reviewRepository.findByUserIdAndBookId(userId, bookId);
        return validateReview != null;
    }

    @Transactional(readOnly = true)
    public Page<ReviewDto.ReviewResponse> getBookReviews(Long bookId, Pageable pageable) {
        return reviewRepository.findByBookId(bookId, pageable)
                .map(reviewMapper::toReviewResponse);
    }
}
