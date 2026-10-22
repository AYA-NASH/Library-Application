package com.luv2code.spring_boot_library.repository;

import com.luv2code.spring_boot_library.entity.RefreshToken;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    // Row lock serializes concurrent refreshes of the same token.
    // JOIN FETCH loads the user inside the transaction (no LazyInitializationException later).
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT rt FROM RefreshToken rt
            JOIN FETCH rt.user
            WHERE rt.tokenHash = :tokenHash
            """)
    Optional<RefreshToken> findByTokenHashForUpdate(@Param("tokenHash") String tokenHash);

    // Used for reuse detection and "log out from all devices".
    @Modifying
    @Query("""
            UPDATE RefreshToken rt
            SET rt.revoked = true, rt.revokedAt = :now
            WHERE rt.user.id = :userId AND rt.revoked = false
            """)
    int revokeAllActiveByUserId(@Param("userId") Long userId, @Param("now") Instant now);

    // Housekeeping: remove rows that can never be used again.
    // Revoked rows are intentionally kept until they expire, so a replayed (stolen) old token
    // is still recognized as "revoked" and triggers reuse detection instead of looking "unknown".
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now")
    int deleteExpired(@Param("now") Instant now);

    void deleteByUser_Id(Long userId);
}
