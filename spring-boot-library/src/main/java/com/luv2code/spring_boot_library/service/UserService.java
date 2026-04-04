package com.luv2code.spring_boot_library.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.mapper.UserMapper;
import com.luv2code.spring_boot_library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Service
public class UserService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${google.client.id:}")
    private String clientId;
    private boolean isNewUser = true;

    public Long getUserIdByEmail(String email) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found with email: " + email);
        }
        return user.getId();
    }

    public void register(UserDtos.SignupRequest request) {
        if (userRepo.existsByEmail(request.email())) {
            throw new RuntimeException("User already registered");
        }
        AppUser user = userMapper.toEntity(request);
        user.setPassword(encoder.encode(request.password()));
        userRepo.save(user);
    }

    public UserDtos.LoginResponse verify(UserDtos.LoginRequest loginRequest) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        if (auth.isAuthenticated()) {
            AppUser foundUser = userRepo.findByEmail(loginRequest.email());

            if (foundUser == null) {
                throw new RuntimeException("User not found after authentication");
            }

            String token = jwtService.generateToken(foundUser.getEmail(), foundUser.getRole());

            return userMapper.toLoginResponse(foundUser, token, false);
        }
        throw new RuntimeException("Invalid credentials");
    }

    public UserDtos.LoginResponse loginWithGoogle(String googleToken) throws GeneralSecurityException, IOException {
        if (clientId == null || clientId.isBlank()) {
            throw new RuntimeException("Google login is not configured on the server.");
        }
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(googleToken);

        if (idToken == null) throw new RuntimeException("Invalid Google token");

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        boolean isNewUser = false;

        AppUser user = userRepo.findByEmail(email);
        if (user == null) {
            var googleData = new UserDtos.GoogleUser(email, (String) payload.get("name"));

            user = userMapper.fromGoogle(googleData);

            userRepo.save(user);
            isNewUser = true;
        }

        String jwt = jwtService.generateToken(user.getEmail(), user.getRole());
        return userMapper.toLoginResponse(user, jwt, isNewUser);
    }
}
