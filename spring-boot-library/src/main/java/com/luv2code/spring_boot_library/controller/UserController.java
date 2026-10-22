package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.dto.ErrorsDto;
import com.luv2code.spring_boot_library.dto.UserDtos;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.exception.UnauthenticatedException;
import com.luv2code.spring_boot_library.mapper.UserMapper;
import com.luv2code.spring_boot_library.service.JwtService;
import com.luv2code.spring_boot_library.service.RefreshTokenService;
import com.luv2code.spring_boot_library.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Duration;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
@Tag(name = "Identity & Access", description = "Authentication and registration endpoints")
public class UserController {

    // Single source of truth for the cookie name (used when setting, reading and clearing it).
    public static final String REFRESH_COOKIE_NAME = "refresh_token";
    private static final String REFRESH_COOKIE_PATH = "/api";

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    @Value("${app.refresh-token.expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Value("${app.refresh-token.cookie-secure:false}")
    private boolean refreshCookieSecure;

    @Value("${app.refresh-token.cookie-same-site:Lax}")
    private String refreshCookieSameSite;


    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account with the provided details.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User successfully registered"),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists",
                    content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> register(
            @Parameter(description = "User registration details")
            @Valid @RequestBody UserDtos.SignupRequest user
    ) {
        userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content(schema = @Schema(implementation = ErrorsDto.ApiErrorResponse.class)))
    })
    public ResponseEntity<UserDtos.LoginResponse> login(
            @Valid @RequestBody @Parameter(description = "Login credentials") UserDtos.LoginRequest loginRequest
    ) {
        UserService.AuthResult result = userService.verify(loginRequest);
        ResponseCookie cookie = createRefreshCookie(result.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.response());
    }

    @PostMapping("/google-login")
    @Operation(summary = "Google Social Login", description = "Authenticates a user using a Google OAuth token.")
    public ResponseEntity<UserDtos.LoginResponse> loginWithGoogle(
            @RequestBody Map<String, String> payload
    ) throws GeneralSecurityException, IOException {
        UserService.AuthResult result =
                userService.loginWithGoogle(payload.get("token"));

        ResponseCookie cookie = createRefreshCookie(result.refreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(result.response());
    }

    @GetMapping("/csrf")
    public Map<String, String> getCsrfToken(CsrfToken csrfToken) {
        // Accessing the token forces Spring Security to generate it
        // and CookieCsrfTokenRepository to save its cookie.
        return Map.of("token", csrfToken.getToken());
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Rotates the HttpOnly refresh-token cookie and returns a new short-lived access token.")
    public ResponseEntity<UserDtos.RefreshResponse> refresh(
            @CookieValue(
                    name = REFRESH_COOKIE_NAME,
                    required = false
            ) String rawRefreshToken
    ) {
        try {
            RefreshTokenService.RotationResult result =
                    refreshTokenService.rotateRefreshToken(rawRefreshToken);
            AppUser user = result.user();

            String newAccessToken = jwtService.generateToken(
                    user.getId(),
                    user.getEmail(),
                    user.getRole()
            );
            UserDtos.RefreshResponse response =
                    new UserDtos.RefreshResponse(
                            newAccessToken,
                            userMapper.toUserInfo(user)
                    );

            ResponseCookie replacementCookie =
                    createRefreshCookie(result.token());

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.SET_COOKIE,
                            replacementCookie.toString()
                    )
                    .body(response);
        } catch (UnauthenticatedException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .header(
                            HttpHeaders.SET_COOKIE,
                            clearRefreshCookie().toString()
                    )
                    .build();
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout", description = "Revokes the current refresh token and clears its cookie.")
    public ResponseEntity<Void> logout(
            @CookieValue(
                    name = REFRESH_COOKIE_NAME,
                    required = false
            ) String rawRefreshToken
    ) {
        refreshTokenService.revokeRefreshToken(rawRefreshToken);

        return ResponseEntity.noContent()
                .header(
                        HttpHeaders.SET_COOKIE,
                        clearRefreshCookie().toString()
                )
                .build();
    }

    private ResponseCookie clearRefreshCookie() {
        return buildRefreshCookie("", Duration.ZERO);
    }

    private ResponseCookie createRefreshCookie(String token) {
        return buildRefreshCookie(token, Duration.ofMillis(refreshTokenExpirationMs));
    }

    // Clearing only works if name, path, domain and flags match the original cookie, so both go through one builder.
    private ResponseCookie buildRefreshCookie(String value, Duration maxAge) {
        return ResponseCookie.from(REFRESH_COOKIE_NAME, value)
                .httpOnly(true)
                .secure(refreshCookieSecure)
                .sameSite(refreshCookieSameSite)
                .path(REFRESH_COOKIE_PATH)
                .maxAge(maxAge)
                .build();
    }
}
