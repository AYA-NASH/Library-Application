package com.luv2code.spring_boot_library.dto;

public sealed interface PaymentDtos {
    record PaymentResponse(
            Long userId,
            double lateFeesInDollars
    ) implements PaymentDtos {
    }
}
