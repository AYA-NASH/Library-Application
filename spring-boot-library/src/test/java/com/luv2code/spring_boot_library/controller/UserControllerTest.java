package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.exception.DuplicateResourceException;
import com.luv2code.spring_boot_library.service.JwtService;
import com.luv2code.spring_boot_library.service.MyUserDetailsService;
import com.luv2code.spring_boot_library.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.willThrow;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private MyUserDetailsService userDetailsService;

    @Test
    @WithMockUser
    void register_duplicateEmail_returnsConflictApiError() throws Exception {
        String payload = """
                  {"username":"aya","email":"aya@mail.com","password":"123456"}
                """;
        willThrow(new DuplicateResourceException("An account with this email already exists"))
                .given(userService)
                .register(any(UserDtos.SignupRequest.class));

        mockMvc.perform(post("/api/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isConflict()) // Verifies the 409 status
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Conflict"))
                .andExpect(jsonPath("$.message").value("An account with this email already exists"))
                .andExpect(jsonPath("$.path").value("/api/register"));
    }
}
