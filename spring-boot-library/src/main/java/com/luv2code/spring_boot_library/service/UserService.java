package com.luv2code.spring_boot_library.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.luv2code.spring_boot_library.dao.UserRepository;
import com.luv2code.spring_boot_library.dto.LoginResponse;
import com.luv2code.spring_boot_library.entity.AppUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Value("${google.client.id}")
    private String clientId;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    public AppUser register(AppUser user) {
        user.setPassword(encoder.encode(user.getPassword()));
        System.out.println("Calling register method at the UserService");
        return userRepo.save(user);
    }

    public LoginResponse verify(AppUser user) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (auth.isAuthenticated()) {
            AppUser foundUser = userRepo.findByEmail(user.getEmail());

            if (foundUser == null) {
                throw new RuntimeException("User not found after authentication");
            }

            String token = jwtService.generateToken(foundUser.getEmail(), foundUser.getRole());

            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                    foundUser.getUsername(),
                    foundUser.getEmail(),
                    foundUser.getRole()
            );
            return new LoginResponse(token, userInfo);
        }

        throw new RuntimeException("Invalid credentials");
    }

    public ResponseEntity<?> loginWithGoogle(String googleToken) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                AppUser user = userRepo.findByEmail(email);
                if (user == null) {
                    user = new AppUser();
                    user.setEmail(email);
                    user.setUsername(name);
                    user.setPassword("");
                    user.setRole("USER");
                    userRepo.save(user);
                }

                String jwt = jwtService.generateToken(user.getEmail(), user.getRole());

                Map<String, Object> response = new HashMap<>();
                response.put("token", jwt);
                response.put("user", Map.of(
                        "email", user.getEmail(),
                        "username", user.getUsername(),
                        "role", user.getRole()
                ));

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying Google token");
        }
    }
}
