package com.luv2code.spring_boot_library.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {
	@Value("${app.jwt.secret:}")
	private String configuredSecret;

	@Value("${app.jwt.expiration-ms:3600000}")
	private long expirationMs; // default 1 hour

	public String generateToken(String email, String role) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("role", role);

		long now = System.currentTimeMillis();
		long expiration = now + expirationMs;

		return Jwts.builder()
				.claims()
				.add(claims)
				.subject(email)
				.issuedAt(new Date(now))
				.expiration(new Date(expiration))
				.and()
				.signWith(getKey())
				.compact();
	}

	private SecretKey getKey() {
		if (configuredSecret == null || configuredSecret.isBlank()) {
			throw new IllegalStateException("JWT secret not configured. Set app.jwt.secret (base64)");
		}
		byte[] keyBytes = Decoders.BASE64.decode(configuredSecret);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String email = extractEmail(token);
		return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		return extractClaim(token, Claims::getExpiration);
	}

	public String extractEmail(String token) {
		return extractClaim(token, Claims::getSubject);
	}

	private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
