package com.luv2code.spring_boot_library.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.luv2code.spring_boot_library.dto.DashboardDtos;
import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.event.ActivityOccurredEvent;
import com.luv2code.spring_boot_library.exception.DuplicateResourceException;
import com.luv2code.spring_boot_library.exception.ResourceNotFoundException;
import com.luv2code.spring_boot_library.exception.UnauthenticatedException;
import com.luv2code.spring_boot_library.mapper.UserMapper;
import com.luv2code.spring_boot_library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDateTime;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class UserService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private final UserRepository userRepo;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ApplicationEventPublisher eventPublisher;

    @Value("${google.client.id:}")
    private String clientId;
    private boolean isNewUser = true;

    public Long getUserIdByEmail(String email) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }
        return user.getId();
    }

    public void register(UserDtos.SignupRequest request) {
        if (userRepo.existsByEmail(request.email())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
        AppUser user = userMapper.toEntity(request);
        user.setPassword(encoder.encode(request.password()));
        userRepo.save(user);

        DashboardDtos.RecentActivity activity = new DashboardDtos.RecentActivity(
                DashboardDtos.EventCategory.USER_MANAGEMENT,
                DashboardDtos.ActionType.USER_REGISTRATION,
                user.getEmail(),
                "New Account",
                LocalDateTime.now()
        );

        eventPublisher.publishEvent(new ActivityOccurredEvent(activity));
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
                throw new ResourceNotFoundException("User could not be found in the database");
            }

            String token = jwtService.generateToken(foundUser.getId(), foundUser.getEmail(), foundUser.getRole());

            return userMapper.toLoginResponse(foundUser, token, false);
        }
        throw new UnauthenticatedException("Incorrect email or password");
    }

    public UserDtos.LoginResponse loginWithGoogle(String googleToken) throws GeneralSecurityException, IOException {
        if (clientId == null || clientId.isBlank()) {
            throw new IllegalStateException("Google Client ID is missing");
        }
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
                .setAudience(Collections.singletonList(clientId))
                .build();

        GoogleIdToken idToken = verifier.verify(googleToken);

        if (idToken == null) throw new UnauthenticatedException("Invalid Google token");

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

        String jwt = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
        return userMapper.toLoginResponse(user, jwt, isNewUser);
    }
}
