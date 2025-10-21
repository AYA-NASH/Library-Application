package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.LoginResponse;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public AppUser register(@RequestBody AppUser user) {
        System.out.println("Controller Request User: " + user);
        return userService.register(user);
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
