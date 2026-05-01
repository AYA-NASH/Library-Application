package com.luv2code.spring_boot_library.dto;

import jakarta.validation.constraints.PositiveOrZero;

public sealed interface PaymentDtos {

    record PaymentResponse(
            Long userId,
            @PositiveOrZero
            double lateFeesInDollars
    ) implements PaymentDtos {
    }

    record PaymentIntentDto(
            String clientSecret,
            Long amount,
            String currency
    ) implements PaymentDtos {
    }

    record AdminOutstandingResponse(
            Long userId,
            String userEmail,
            Long lateFees
    ) implements PaymentDtos {
    }
}
