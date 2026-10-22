package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.RefreshToken;
import com.luv2code.spring_boot_library.exception.UnauthenticatedException;
import com.luv2code.spring_boot_library.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RefreshTokenServiceTest {
    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(
                refreshTokenService,
                "expirationMs",
                604800000L
        );

        user = new AppUser();
        user.setId(1L);
        user.setEmail("test@example.com");
    }

    @Test
    void createRefreshToken_shouldSaveTokenAndReturnValue() {
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String rawToken = refreshTokenService.createRefreshToken(user);

        assertNotNull(rawToken);
        assertFalse(rawToken.isBlank());

        var captor = ArgumentCaptor.forClass(RefreshToken.class);

        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken savedToken = captor.getValue();

        assertEquals(user, savedToken.getUser());
        assertNotNull(savedToken.getTokenHash());
        assertNotEquals(rawToken, savedToken.getTokenHash());
        assertFalse(savedToken.isRevoked());
        assertTrue(
                savedToken.getExpiryDate().isAfter(Instant.now())
        );
    }

    @Test
    void verifyRefreshToken_shouldReturnValidToken() {
        RefreshToken token = createToken(false,
                Instant.now().plusSeconds(600));

        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(token));

        RefreshToken result =
                refreshTokenService.verifyRefreshToken("valid-raw-token");

        assertSame(token, result);
    }

    @Test
    void verifyRefreshToken_ShouldRejectRevokedToken() {
        RefreshToken token = createToken(true, Instant.now().plusSeconds(600));

        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(token));

        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.verifyRefreshToken("revoked-raw-token")
        );
    }

    @Test
    void verifyRefreshToken_shouldRejectExpiredToken() {
        RefreshToken token = createToken(false, Instant.now().minusSeconds(600));

        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(token));

        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.verifyRefreshToken("expired-raw-token")
        );
    }

    @Test
    void verifyRefreshToken_shouldRejectMissingToken() {
        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.verifyRefreshToken(null)
        );

        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.verifyRefreshToken(" ")
        );

        verifyNoInteractions(refreshTokenRepository);
    }

    @Test
    void verifyRefreshToken_shouldRejectUnknownToken() {
        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.verifyRefreshToken("unknown-token")
        );

        verify(refreshTokenRepository).findByTokenHash(anyString());
    }

    @Test
    void rotateRefreshToken_shouldRevokeOldTokenAndIssueReplacement(){
        RefreshToken oldToken = createToken(false, Instant.now().plusSeconds(600));

        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.of(oldToken));

        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        RefreshTokenService.RotationResult result = refreshTokenService.rotateRefreshToken("old-raw-token");

        assertTrue(oldToken.isRevoked());
        assertEquals(oldToken.getUser(), result.user());
        assertNotNull(result.token());
        assertNotEquals("old-raw-token", result.token());

        verify(refreshTokenRepository, times(2))
                .save(any(RefreshToken.class));
    }

    @Test
    void rotateRefreshToken_shouldRejectReuseOfRevokedToken() {
        RefreshToken oldToken = createToken(true, Instant.now().plusSeconds(600));

        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.of(oldToken));

        assertThrows(UnauthenticatedException.class,
                ()-> refreshTokenService.rotateRefreshToken("old-raw-token"));

        verify(refreshTokenRepository, never())
                .save(any(RefreshToken.class));
    }

    @Test
    void rotateRefreshToken_shouldRejectUnknownToken() {
        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.empty());

        assertThrows(
                UnauthenticatedException.class,
                () -> refreshTokenService.rotateRefreshToken("unknown-token")
        );

        verify(refreshTokenRepository)
                .findByTokenHashForUpdate(anyString());

        verify(refreshTokenRepository, never())
                .save(any(RefreshToken.class));
    }

    private RefreshToken createToken(boolean revoked, Instant expiryDate) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash("test-hash");
        token.setExpiryDate(expiryDate);
        token.setRevoked(revoked);

        return token;
    }
}
