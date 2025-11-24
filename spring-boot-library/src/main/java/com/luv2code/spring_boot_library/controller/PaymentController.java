package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.requestmodel.PaymentInfoRequest;
import com.luv2code.spring_boot_library.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/secure")
public class PaymentController {
    private PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    @PostMapping("/payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest)
        throws StripeException{
        try {
            PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
            String paymentString = paymentIntent.toJson();
            return new ResponseEntity<>(paymentString, HttpStatus.OK);
        } catch (IllegalStateException ex) {
            return new ResponseEntity<>("Stripe is not configured", HttpStatus.SERVICE_UNAVAILABLE);
        }
    }

    @PutMapping("/payment-complete")
    public ResponseEntity<String> stripePaymentComplete() throws Exception {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();

        return paymentService.stripePayment(userEmail);
    }
}
