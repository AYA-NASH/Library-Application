package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.responsemodel.LoginResponse;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.requestmodel.SignupRequest;
import com.luv2code.spring_boot_library.service.UserService;
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
    public ResponseEntity<?> register(@RequestBody SignupRequest user) {
        try {
            userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody AppUser user) {
        return userService.verify(user);
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> payload) {
        String googleToken = payload.get("token");
        return userService.loginWithGoogle(googleToken);
    }
}
