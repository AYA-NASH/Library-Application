package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.PaymentRepository;
import com.luv2code.spring_boot_library.entity.Checkout;
import com.luv2code.spring_boot_library.entity.Payment;
import com.luv2code.spring_boot_library.requestmodel.PaymentInfoRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class PaymentService {
    private PaymentRepository paymentRepository;

    private final boolean stripeEnabled;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, @Value("${stripe.key.secret:}") String secretKey) {
        this.paymentRepository = paymentRepository;
        if (secretKey != null && !secretKey.isBlank()) {
            Stripe.apiKey = secretKey;
            this.stripeEnabled = true;
        } else {
            this.stripeEnabled = false;
        }
    }

    public PaymentIntent createPaymentIntent(PaymentInfoRequest paymentInfoRequest) throws StripeException {
        if (!stripeEnabled) {
            throw new IllegalStateException("Stripe is not configured");
        }
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", paymentInfoRequest.getAmount());
        params.put("currency", paymentInfoRequest.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);

        return PaymentIntent.create(params);
    }

    public ResponseEntity<String> stripePayment(String userEmail) throws Exception {
        if (!stripeEnabled) {
            return new ResponseEntity<>("Stripe is not configured", HttpStatus.SERVICE_UNAVAILABLE);
        }
        Payment payment = paymentRepository.findByUserEmail(userEmail);

        if (payment == null) {
            throw new Exception("Payment information is missing");
        }
        payment.setAmount(00.00);
        paymentRepository.save(payment);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
