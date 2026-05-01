package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.PaymentDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.JwtService;
import com.luv2code.spring_boot_library.service.MyUserDetailsService;
import com.luv2code.spring_boot_library.service.PaymentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = PaymentController.class)
public class PaymentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PaymentService paymentService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private MyUserDetailsService userDetailsService;


    @Test
    void createPaymentIntent_ShouldReturn200() throws Exception {
        AppUser userEntity = new AppUser();
        userEntity.setId(1L);
        userEntity.setEmail("test@example.com");

        UserPrincipal customPrincipal = new UserPrincipal(userEntity);

        PaymentDtos.PaymentIntentDto responseDto = new PaymentDtos.PaymentIntentDto(
                "secret_123",
                100L,
                "usd"
        );

        given(paymentService.createPaymentIntent(anyLong())).willReturn(responseDto);

        mockMvc.perform(post("/api/payment/secure/payment-intent")
                        .with(csrf())
                        .with(user(customPrincipal))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").value("secret_123"));
    }

}
