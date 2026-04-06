package com.luv2code.spring_boot_library.mapper;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.Payment;
import com.stripe.model.PaymentIntent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "userId", source = "payment.user.id")
    @Mapping(target = "lateFeesInDollars", expression = "java(payment.getLateFees() / 100.0)")
    PaymentDtos.PaymentResponse toResponse(Payment payment);

    @Mapping(target = "userId", source = "payment.user.id")
    @Mapping(target = "userEmail", source = "payment.user.email")
    PaymentDtos.AdminOutstandingResponse toAdminResponse(Payment payment);

    @Mapping(target = "clientSecret", source = "clientSecret")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "currency", source = "currency")
    PaymentDtos.PaymentIntentDto toIntentDto(PaymentIntent intent);
}
