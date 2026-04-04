package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.Checkout;
import com.luv2code.spring_boot_library.entity.Payment;
import com.luv2code.spring_boot_library.mapper.LoanMapper;
import com.luv2code.spring_boot_library.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BookLoanService {

    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final HistoryRepository historyRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final LoanMapper loanMapper;

    @Transactional(readOnly = true)
    public List<LoanDtos.ShelfResponse> currentLoans(String userEmail) {
        List<Checkout> checkoutList = checkoutRepository.findAllByUserEmailWithBooks(userEmail);

        return checkoutList.stream()
                .map(loanMapper::toShelfResponse)
                .toList();
    }

    public LoanDtos.ShelfResponse checkoutBook(String userEmail, Long bookId) throws Exception {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new Exception("Book not found"));

        validateUserEligibility(userEmail, bookId, book);

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        Checkout checkout = new Checkout();
        checkout.setUser(userRepository.findByEmail(userEmail));
        checkout.setBook(book);
        checkout.setCheckoutDate(LocalDate.now());
        checkout.setReturnDate(LocalDate.now().plusDays(7));

        checkoutRepository.save(checkout);

        return loanMapper.toShelfResponse(checkout);
    }

    public void returnBook(String userEmail, Long bookId) throws Exception {
        AppUser user = userRepository.findByEmail(userEmail);
        if (user == null) throw new Exception("User not found");

        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId)
                .orElseThrow(() -> new Exception("Loan record not found"));

        // 1. Calculate Late Fees (1 unit per day late)
        long overdueDays = ChronoUnit.DAYS.between(checkout.getReturnDate(), LocalDate.now());
        if (overdueDays > 0) {
            handleLatePayment(user, overdueDays);
        }

        // 2. Archive to History (The Snapshot)
        historyRepository.save(loanMapper.toHistoryEntity(checkout));

        // 3. Replenish Inventory and Cleanup
        Book book = checkout.getBook();
        book.setCopiesAvailable(book.getCopiesAvailable() + 1);
        bookRepository.save(book);

        checkoutRepository.delete(checkout);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception {
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId)
                .orElseThrow(() -> new Exception("Loan not found"));

        if (checkout.getReturnDate().isBefore(LocalDate.now())) {
            throw new Exception("Overdue books cannot be renewed. Please return it first.");
        }

        checkout.setReturnDate(LocalDate.now().plusDays(7));
        checkoutRepository.save(checkout);
    }

    public int countCheckouts(String userEmail) {
        return checkoutRepository.countByUserEmail(userEmail);
    }

    public boolean isBookCheckedOutByUser(String userEmail, Long bookId) {
        return checkoutRepository.findByUserEmailAndBookId(userEmail, bookId).isPresent();
    }

    private void validateUserEligibility(String userEmail, Long bookId, Book book) throws Exception {
        AppUser user = userRepository.findByEmail(userEmail);
        if (user == null) throw new Exception("User not found");

        if (book.getCopiesAvailable() <= 0) throw new Exception("No copies available");

        if (checkoutRepository.countByUserEmail(userEmail) >= 5)
            throw new Exception("Maximum loan limit reached (5 books).");

        if (checkoutRepository.existsByUserEmailAndReturnDateBefore(userEmail, LocalDate.now()))
            throw new Exception("You have overdue books. Return them before checking out new ones.");

        if (checkoutRepository.findByUserEmailAndBookId(userEmail, bookId).isPresent())
            throw new Exception("You already have this book checked out.");

        paymentRepository.findByUserId(user.getId()).ifPresent(payment -> {
            if (payment.getLateFees() > 0) {
                double dollars = payment.getLateFees() / 100.0;
                throw new RuntimeException("Outstanding fees: $" + dollars + ". Please pay at the billing section.");
            }
        });
    }

    private void handleLatePayment(AppUser user, long overdueDays) {
        long feeToAdd = overdueDays * 100L;

        Payment payment = paymentRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Payment newPayment = new Payment();
                    newPayment.setUser(user);
                    newPayment.setLateFees(0L);
                    return newPayment;
                });
        payment.setLateFees(payment.getLateFees() + feeToAdd);
        paymentRepository.save(payment);
    }
}
