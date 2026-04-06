package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDtos.SignupRequest user) {
        try {
            userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public UserDtos.LoginResponse login(@Valid @RequestBody UserDtos.LoginRequest loginRequest) {
        return userService.verify(loginRequest);
    }

    @PostMapping("/google-login")
    public UserDtos.LoginResponse loginWithGoogle(@RequestBody Map<String, String> payload) throws Exception {
        String googleToken = payload.get("token");
        return userService.loginWithGoogle(googleToken);
    }
}
