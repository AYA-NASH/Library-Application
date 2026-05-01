package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.PaymentService;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/payment/secure")
@RequiredArgsConstructor
@Tag(name = "User Financials", description = "Endpoints for payments and financial transactions")
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/balance")
    public PaymentDtos.PaymentResponse getUserPayment(@AuthenticationPrincipal UserPrincipal currentUser) {
        return paymentService.getUserPayment(currentUser.getUser().getId());
    }

    @PostMapping("/payment-intent")
    public PaymentDtos.PaymentIntentDto createPaymentIntent(@AuthenticationPrincipal UserPrincipal currentUser) throws StripeException {
        return paymentService.createPaymentIntent(currentUser.getUser().getId());
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<Void> stripePaymentComplete(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        paymentService.completePayment(currentUser.getUser().getId(), idempotencyKey);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/outstanding")
    public Page<PaymentDtos.AdminOutstandingResponse> getOutstandingPayments(Pageable pageable) {
        return paymentService.getOutstandingPayments(pageable);
    }
}
