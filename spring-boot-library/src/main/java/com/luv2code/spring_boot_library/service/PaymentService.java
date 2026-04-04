package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.Payment;
import com.luv2code.spring_boot_library.mapper.PaymentMapper;
import com.luv2code.spring_boot_library.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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

    public PaymentDtos.PaymentResponse getUserPayment(Long userId) {
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Payment newPayment = new Payment();
                    newPayment.setLateFees(0L);
                    return newPayment;
                });
        return paymentMapper.toResponse(payment);
    }

    public PaymentIntent createPaymentIntent(Long userId) throws StripeException {

        // Fetch Amount to pay (Late Fees) from DB.
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No payment record found for user"));

        if (payment.getLateFees() <= 0) {
            throw new RuntimeException("Balance is zero. No payment needed.");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("amount", payment.getLateFees());
        params.put("currency", "usd");
        params.put("payment_method_types", Collections.singletonList("card"));

        return PaymentIntent.create(params);
    }

    public void completePayment(Long userId) throws Exception {
        Payment payment = paymentRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Payment record missing"));

        payment.setLateFees(0L);
        paymentRepository.save(payment);
    }
}
