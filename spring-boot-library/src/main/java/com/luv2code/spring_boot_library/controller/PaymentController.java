package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.service.PaymentService;
import com.luv2code.spring_boot_library.service.UserService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/secure")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    private final UserService userService;

    @GetMapping("/balance")
    public PaymentDtos.PaymentResponse getUserPayment() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByEmail(userEmail);

        return paymentService.getUserPayment(userId);
    }

    @PostMapping("/payment-intent")
    public String createPaymentIntent() throws StripeException {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByEmail(userEmail);
        PaymentIntent intent = paymentService.createPaymentIntent(userId);
        return intent.toJson();
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<Void> stripePaymentComplete() throws Exception {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Long userId = userService.getUserIdByEmail(userEmail);

        paymentService.completePayment(userId);
        return ResponseEntity.ok().build();
    }
}
