package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.Payment;
import com.luv2code.spring_boot_library.mapper.PaymentMapper;
import com.luv2code.spring_boot_library.repository.PaymentRepository;
import com.stripe.model.PaymentIntent;
import com.stripe.net.RequestOptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
public class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentMapper paymentMapper;

    @InjectMocks
    private PaymentService paymentService;

    private Payment mockPayment;
    private AppUser mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new AppUser();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");

        mockPayment = new Payment();
        mockPayment.setId(100L);
        mockPayment.setLateFees(100L);
        mockPayment.setUser(mockUser);
    }

    @Test
    @DisplayName("Should return PaymentIntentDto when balance is positive")
    void createPaymentIntent_Success() throws Exception {
        given(paymentRepository.findByUserId(1L)).willReturn(Optional.of(mockPayment));

        PaymentDtos.PaymentIntentDto expectedDto = new PaymentDtos.PaymentIntentDto(
                "pi_123_secret_abc",
                100L,
                "usd"
        );
        given(paymentMapper.toIntentDto(any(PaymentIntent.class))).willReturn(expectedDto);

        try (MockedStatic<PaymentIntent> mockedPaymentIntent = Mockito.mockStatic(PaymentIntent.class)) {

            PaymentIntent dummyIntent = new PaymentIntent();
            mockedPaymentIntent.when(() -> PaymentIntent.create(any(Map.class), any(RequestOptions.class)))
                    .thenReturn(dummyIntent);

            PaymentDtos.PaymentIntentDto result = paymentService.createPaymentIntent(mockUser.getId());

            assertThat(result).isNotNull();
            assertThat(result).isEqualTo(expectedDto);

            mockedPaymentIntent.verify(() -> PaymentIntent.create(any(Map.class), any(RequestOptions.class)));
        }
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException when balance is zero")
    void createPaymentIntent_ZeroBalance_ThrowsException() {
        mockPayment.setLateFees(0L);
        given(paymentRepository.findByUserId(1L)).willReturn(Optional.of(mockPayment));

        assertThatThrownBy(() -> paymentService.createPaymentIntent(1L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Balance is zero");
    }

    @Test
    @DisplayName("Should complete payment once and ignore duplicate idempotency key")
    void completePayment_DuplicateIdempotencyKey_NoOpOnSecondCall() {
        given(paymentRepository.findByUserId(1L)).willReturn(Optional.of(mockPayment));

        String idemKey = "idem-key-123";

        paymentService.completePayment(1L, idemKey);
        paymentService.completePayment(1L, idemKey);

        assertThat(mockPayment.getLateFees()).isEqualTo(0L);
        assertThat(mockPayment.getLastPaymentCompletionKey()).isEqualTo(idemKey);
        verify(paymentRepository, times(1)).save(mockPayment);
    }

    @Test
    @DisplayName("Should reject blank idempotency key")
    void completePayment_BlankIdempotencyKey_ThrowsException() {
        assertThatThrownBy(() -> paymentService.completePayment(1L, " "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Idempotency key is required");

        verify(paymentRepository, never()).save(any(Payment.class));
    }
}
