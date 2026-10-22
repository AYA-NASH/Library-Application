package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.RefreshToken;
import com.luv2code.spring_boot_library.exception.UnauthenticatedException;
import com.luv2code.spring_boot_library.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@Transactional
@RequiredArgsConstructor
public class RefreshTokenService {
    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public record RotationResult(
            String token,
            AppUser user
    ) {
    }

    @Value("${app.refresh-token.expiration-ms:604800000}")
    private long expirationMs;

    // A revoked token presented within this window is treated as a concurrent refresh
    // (e.g. two tabs refreshing at the same moment), not as an attack.
    @Value("${app.refresh-token.reuse-grace-ms:10000}")
    private long reuseGraceMs;

    public String createRefreshToken(AppUser user) {
        String rawToken = generateRawToken();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(hashToken(rawToken));
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(expirationMs));
        refreshToken.setRevoked(false);

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Transactional(readOnly = true)
    public RefreshToken verifyRefreshToken(String rawToken) {
        RefreshToken token = findValidatableToken(rawToken);

        if (token.isRevoked()) {
            throw new UnauthenticatedException("Refresh token has been revoked");
        }

        if (!token.getExpiryDate().isAfter(Instant.now())) {
            throw new UnauthenticatedException("Refresh token has expired");
        }

        return token;
    }

    /**
     * Rotation: the presented token is revoked and a brand-new one is issued.
     * noRollbackFor is required so the "revoke all sessions" write performed during
     * reuse detection is committed even though we then throw UnauthenticatedException.
     */
    @Transactional(noRollbackFor = UnauthenticatedException.class)
    public RotationResult rotateRefreshToken(String rawToken) {
        RefreshToken oldToken = refreshTokenRepository
                .findByTokenHashForUpdate(hashToken(rawToken))
                .orElseThrow(() -> new UnauthenticatedException("Invalid refresh token"));

        if (oldToken.isRevoked()) {
            handleRevokedTokenUse(oldToken);
        }

        if (!oldToken.getExpiryDate().isAfter(Instant.now())) {
            throw new UnauthenticatedException("Refresh token has expired");
        }

        AppUser user = oldToken.getUser();
        oldToken.revoke();
        refreshTokenRepository.save(oldToken);

        String replacement = createRefreshToken(user);
        return new RotationResult(replacement, user);
    }

    public void revokeRefreshToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }

        refreshTokenRepository
                .findByTokenHashForUpdate(hashToken(rawToken))
                .ifPresent(token -> {
                    if (!token.isRevoked()) {
                        token.revoke();
                        refreshTokenRepository.save(token);
                    }
                });
    }

    // "Log out from all devices" (also useful after a password change).
    public void revokeAllForUser(Long userId) {
        refreshTokenRepository.revokeAllActiveByUserId(userId, Instant.now());
    }

    // Daily housekeeping at 03:00.
    @Scheduled(cron = "${app.refresh-token.cleanup-cron:0 0 3 * * *}")
    public void purgeExpiredTokens() {
        int deleted = refreshTokenRepository.deleteExpired(Instant.now());
        if (deleted > 0) {
            log.info("Purged {} expired refresh tokens", deleted);
        }
    }

    private void handleRevokedTokenUse(RefreshToken token) {
        Instant revokedAt = token.getRevokedAt();
        boolean withinGrace = revokedAt != null
                && revokedAt.plusMillis(reuseGraceMs).isAfter(Instant.now());

        if (withinGrace) {
            // Benign race: another tab just rotated this token. The browser already holds the new cookie,
            // so the client can simply retry once.
            throw new UnauthenticatedException("Refresh token was already rotated");
        }

        // Real reuse: an old token is being replayed. Assume it was stolen and kill every session of this user.
        Long userId = token.getUser().getId();
        int revoked = refreshTokenRepository.revokeAllActiveByUserId(userId, Instant.now());
        log.warn("Refresh token reuse detected for user {}. Revoked {} active session(s).", userId, revoked);

        throw new UnauthenticatedException("Refresh token reuse detected");
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32]; // 256 bits of entropy
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String hashToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new UnauthenticatedException("Refresh token is missing");
        }

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }

    private RefreshToken findValidatableToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new UnauthenticatedException("Refresh token is missing");
        }

        return refreshTokenRepository
                .findByTokenHash(hashToken(rawToken))
                .orElseThrow(() -> new UnauthenticatedException("Invalid refresh token"));
    }
}
