package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.service.UserService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.luv2code.spring_boot_library.dto.ErrorsDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Identity & Access", description = "Authentication and registration endpoints")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with the provided details.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists", 
                         content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public ResponseEntity<?> register(@Valid @RequestBody @Parameter(description = "User registration details") UserDtos.SignupRequest user) {
        try {
            userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", 
                         content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public UserDtos.LoginResponse login(@Valid @RequestBody @Parameter(description = "Login credentials") UserDtos.LoginRequest loginRequest) {
        return userService.verify(loginRequest);
    }

    @PostMapping("/google-login")
    @Operation(summary = "Google Social Login", description = "Authenticates a user using a Google OAuth token.")
    public UserDtos.LoginResponse loginWithGoogle(@RequestBody Map<String, String> payload) throws Exception {
        String googleToken = payload.get("token");
        return userService.loginWithGoogle(googleToken);
    }
}
