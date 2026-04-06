package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.Payment;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.mapper.PaymentMapper;
import com.luv2code.spring_boot_library.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentMapper paymentMapper;
    private final PaymentRepository paymentRepository;
    
    @Value("${stripe.key.secret}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Transactional(readOnly = true)
    public PaymentDtos.PaymentResponse getUserPayment(Long userId) {
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Payment newPayment = new Payment();
                    newPayment.setLateFees(0L);
                    return newPayment;
                });
        return paymentMapper.toResponse(payment);
    }

    public PaymentDtos.PaymentIntentDto createPaymentIntent(Long userId) throws StripeException {
        // Fetch Amount to pay (Late Fees) from DB.
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment record found for user"));

        if (payment.getLateFees() <= 0) {
            throw new IllegalArgumentException("Balance is zero. No payment needed.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("amount", payment.getLateFees());
        params.put("currency", "usd");
        params.put("payment_method_types", Collections.singletonList("card"));

        PaymentIntent intent = PaymentIntent.create(params);
        return paymentMapper.toIntentDto(intent);
    }

    public void completePayment(Long userId) {
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record missing"));

        payment.setLateFees(0L);
        paymentRepository.save(payment);
    }

    @Transactional(readOnly = true)
    public Page<PaymentDtos.AdminOutstandingResponse> getOutstandingPayments(Pageable pageable) {
        return paymentRepository.findAllByLateFeesGreaterThan(0L, pageable)
                .map(paymentMapper::toAdminResponse);
    }
}
